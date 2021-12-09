import { PERIOD_CHARTS } from '@constants';
import { useCurrenciesCandlesHistory } from 'common/queries/__generated__/get-currencies-candles-history.mutation';
import StyledLineChart from 'components/StyledLineChart';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'store';
import styled from 'styled-components/native';

type CoinChartProps = {
  currency: string;
};

type PeriodType = 'week' | 'month' | 'quarter' | 'year' | 'all';

const CoinChart: React.FC<CoinChartProps> = ({ currency }) => {
  const baseCurrency = useSelector(selectors.baseCurrency.selectBaseCurrency);
  const [period, setPeriod] = useState<PERIOD_CHARTS>(PERIOD_CHARTS.WEEK);
  const dataMapping: Record<PeriodType, any> = {
    week: {
      timeframe: '1h',
      period: 'week',
      from: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7).valueOf(),
    },
    month: {
      timeframe: '1h',
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
  const [currenciesCandlesHistory, { data: candlesHistoryResp }] = useCurrenciesCandlesHistory({
    variables: {
      currencyFrom: currency,
      currencyTo: baseCurrency,
      to: new Date().getTime(),
      currentTime: new Date().getTime(),
      ...dataMapping[period],
    },
  });

  const dataChart = useMemo(() => {
    return (
      candlesHistoryResp?.currenciesCandlesHistory
        .map((value) => {
          const [timestamp, ...val] = value as number[];
          let sumValue = 0;
          val.forEach((item) => (sumValue += item));

          return {
            timestamp: timestamp,
            value: sumValue / 4,
          };
        })
        .sort((a, b) => a.timestamp - b.timestamp) || []
    );
  }, [candlesHistoryResp?.currenciesCandlesHistory]);

  useEffect(() => {
    currenciesCandlesHistory();
  }, [period, baseCurrency]);

  return <Charts isCoinChart data={dataChart} period={period} onChangePeriod={setPeriod} />;
};

const Charts = styled(StyledLineChart)`
  margin-bottom: 32px;
`;

export default CoinChart;
