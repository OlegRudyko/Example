import { PERIOD_CHARTS } from '@constants';
import {
  CurrenciesCandlesHistory,
  useCurrenciesCandlesHistory,
} from 'common/queries/__generated__/get-currencies-candles-history.mutation';
import StyledLineChart from 'components/StyledLineChart';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'store';
import styled from 'styled-components/native';
import { ChartSkeleton } from 'ui/skeletons';

type CoinChartProps = {
  currency: string;
};
type CandlesItem = { timestamp: number; value: number };
type PeriodType = 'week' | 'month' | 'quarter' | 'year' | 'all';
type CandlesHistory = {
  week: CandlesItem[];
  month: CandlesItem[];
  quarter: CandlesItem[];
  year: CandlesItem[];
  all: CandlesItem[];
};

const transformHistory = (arr: CurrenciesCandlesHistory) => {
  return (
    arr.currenciesCandlesHistory
      .map((value) => {
        const [timestamp, ...val] = value as number[];
        return {
          timestamp: timestamp,
          value: val[0],
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp) || []
  );
};

const CoinChart: React.FC<CoinChartProps> = ({ currency }) => {
  const baseCurrency = useSelector(selectors.baseCurrency.selectBaseCurrency);
  const [period, setPeriod] = useState<PERIOD_CHARTS>(PERIOD_CHARTS.WEEK);
  const [isLoading, setIsLoading] = useState(false);
  const [candlesHistory, setCandlesHistory] = useState<CandlesHistory>({
    week: [],
    month: [],
    quarter: [],
    year: [],
    all: [],
  });
  const dataMapping: Record<PeriodType, any> = {
    week: {
      timeframe: '1h',
      period: 'week',
      from: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7).valueOf(),
    },
    month: {
      timeframe: '1d',
      period: 'month',
      from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()).valueOf(),
    },
    quarter: {
      timeframe: '1d',
      period: 'quarter',
      from: new Date(new Date().getFullYear(), new Date().getMonth() - 3, new Date().getDate()).valueOf(),
    },
    year: {
      timeframe: '1d',
      period: 'year',
      from: new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate()).valueOf(),
    },
    all: {
      timeframe: '1d',
      period: 'year',
      from: new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate()).valueOf(),
    },
  };
  const [currenciesCandlesHistory] = useCurrenciesCandlesHistory({
    variables: {
      currencyFrom: currency,
      currencyTo: baseCurrency,
      to: new Date().getTime(),
      currentTime: new Date().getTime(),
      ...dataMapping[period],
    },
    onCompleted: (res) => {
      if (res.currenciesCandlesHistory) {
        const value = {
          ...candlesHistory,
          [period]: transformHistory(res),
        };
        setCandlesHistory(value);
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    setCandlesHistory({ week: [], month: [], quarter: [], year: [], all: [] });
    setIsLoading(true);
    currenciesCandlesHistory();
  }, [baseCurrency]);

  useEffect(() => {
    if (!candlesHistory[period].length) {
      setIsLoading(true);
      currenciesCandlesHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  return isLoading ? (
    <ChartSkeleton />
  ) : (
    <Charts isCoinChart data={candlesHistory[period]} period={period} onChangePeriod={setPeriod} />
  );
};

const Charts = styled(StyledLineChart)`
  margin-bottom: 32px;
`;

export default CoinChart;
