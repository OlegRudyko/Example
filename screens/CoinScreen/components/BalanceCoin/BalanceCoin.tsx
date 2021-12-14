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
import { BalanceSkeleton, PriceMoveBadgesSkeleton } from 'ui/skeletons';
import { prettyCurrencyAmount } from 'utils';
import { getVelocity } from 'utils/priceRate';

type BalanceCoinProps = {
  currency: Currencies | undefined;
};

const BalanceCoin: React.FC<BalanceCoinProps> = ({ currency = {} as Currencies }) => {
  const coin = useTypedTranslation<TranslationObject['screens']['coin']>('screens.coin');
  const baseCurrency = useSelector(selectors.baseCurrency.selectBaseCurrency);
  const priceRate = useSelector(selectors.priceRate.selectPriceRateByFromTo(currency.currency, baseCurrency));
  const velocityBalance = useMemo(() => {
    const prevVelocity = (priceRate?.open || 0) * currency.balance;

    const currentVelocity = (priceRate?.price || 0) * currency.balance;

    return getVelocity(prevVelocity, currentVelocity);
  }, [currency, priceRate]);

  const balance = useMemo(() => {
    return ((priceRate?.price || 0) * currency.balance).toFixed(FIXED_NUMBER[baseCurrency] || 2);
  }, [baseCurrency, currency.balance, priceRate?.price]);

  const isLoadingBalance = useMemo(
    () => currency.balance > 0 && priceRate === undefined,
    [currency.balance, priceRate],
  );

  return (
    <Root>
      <Header>
        <CurrencyIcon currency={currency.currency} width={30} height={30} />
        <CoinName variant="title24Bold">{currency.alias}</CoinName>
        {priceRate === undefined ? (
          <PriceMoveBadgesSkeleton />
        ) : (
          <PriceMoveBadges
            value={Math.abs(velocityBalance).toString()}
            movement={velocityBalance === 0 ? 'base' : velocityBalance > 0 ? 'up' : 'down'}
            isPercent
          />
        )}
      </Header>
      <Text variant="bodyRegular">{coin.balance}</Text>
      <BalanceWrapper>
        {isLoadingBalance ? (
          <BalanceSkeleton />
        ) : (
          <BalanceBlock>
            <Balance variant="title16Medium">{`${prettyCurrencyAmount(currency.balance, currency)} ${
              currency.currency
            } =`}</Balance>

            <Balance variant="title16Medium">{`= ${balance} ${baseCurrency}`}</Balance>
          </BalanceBlock>
        )}
        <StyledCurrencyBadges />
      </BalanceWrapper>
    </Root>
  );
};

const Root = styled.View`
  padding: 8px 8px 16px 8px;
  border-radius: 16px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 18px;
`;

const CoinName = styled(AppText)`
  flex: 1;
  margin: 0px 8px;
`;

const Text = styled(AppText)`
  margin-bottom: 8px;
`;

const BalanceBlock = styled.View`
  flex: 1;
`;

const BalanceWrapper = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-top: 4px;
`;

const Balance = styled(AppText)`
  margin-right: 4px;
`;

const StyledCurrencyBadges = styled(CurrencyBadges)`
  margin-left: auto;
`;

export default BalanceCoin;
