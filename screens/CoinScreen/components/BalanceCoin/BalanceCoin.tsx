import { Currencies } from '__generated__/types';
import { FIXED_NUMBER } from '@constants';
import { CurrencyBadges, CurrencyIcon } from 'components';
import { useTypedTranslation } from 'hooks';
import { TranslationObject } from 'libs/i18n';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'store';
import styled from 'styled-components/native';
import { AppText, PriceMoveBadges } from 'ui';
import { priceRate } from 'utils';

type BalanceCoinProps = {
  currency: Currencies;
};

const BalanceCoin: React.FC<BalanceCoinProps> = ({ currency }) => {
  const coin = useTypedTranslation<TranslationObject['screens']['coin']>('screens.coin');
  const pricesRate = useSelector(selectors.priceRate.selectAllPriceRate);
  const baseCurrency = useSelector(selectors.baseCurrency.selectBaseCurrency);
  const velocityBalance = useMemo(() => {
    return priceRate.getBalanceVelocity([currency], pricesRate, baseCurrency);
  }, [currency, pricesRate, baseCurrency]);

  const balance = useMemo(() => {
    return priceRate.getCurrentBalance([currency], baseCurrency, pricesRate).toFixed(FIXED_NUMBER[baseCurrency] || 2);
  }, [baseCurrency, currency, pricesRate]);

  return (
    <Root>
      <Header>
        <CurrencyIcon currency={currency.currency} width={30} height={30} />
        <CoinName variant="title24Bold">{currency.alias}</CoinName>
        <PriceMoveBadges
          value={Math.abs(velocityBalance).toString()}
          movement={velocityBalance === 0 ? 'base' : velocityBalance > 0 ? 'up' : 'down'}
          isPercent
        />
      </Header>
      <Text variant="bodyRegular">{coin.balance}</Text>
      <BalanceBlock>
        <Balance variant="title16Medium">{`${currency.balance} ${currency.currency} =`}</Balance>
        <BalanceWrapper>
          <Balance variant="title16Medium">{`= ${balance}`}</Balance>
          <CurrencyBadges />
        </BalanceWrapper>
      </BalanceBlock>
    </Root>
  );
};

const Root = styled.View`
  padding: 8px 8px 16px 8px;
  border-radius: 16px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 18px;
`;

const CoinName = styled(AppText)`
  margin: 0px 8px;
`;

const Text = styled(AppText)`
  margin-bottom: 8px;
`;

const BalanceBlock = styled.View``;

const BalanceWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const Balance = styled(AppText)`
  margin-right: 4px;
`;

export default BalanceCoin;
