import { Currencies, TransactionAllInformation } from '__generated__/types';
import { FIXED_NUMBER } from '@constants';
import { CurrencyIcon } from 'components';
import { useTypedTranslation } from 'hooks';
import { TranslationObject } from 'libs/i18n';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'store';
import styled from 'styled-components/native';
import { AppText, Separator } from 'ui';
import { priceRate, shorteredValue } from 'utils';
import { getCurrencyWithBallance } from 'utils/filtering';

type FiatAndExchangeOperationsProps = {
  operation: TransactionAllInformation;
  fullData: Currencies[];
};

const FiatAndExchangeOperations: React.FC<FiatAndExchangeOperationsProps> = ({ operation, fullData }) => {
  const baseCurrency = useSelector(selectors.baseCurrency.selectBaseCurrency);
  const filteredCurrencies = useMemo(() => getCurrencyWithBallance([...fullData]), [fullData]);
  const currencyFrom = fullData.find((item) => item.id === operation.currencyFrom)?.currency;
  const currencyTo = fullData.find((item) => item.id === operation.currencyTo)?.currency;
  const transactionInfo =
    useTypedTranslation<TranslationObject['components']['transactionInfo']>('components.transactionInfo');
  const pricesRate = useSelector(selectors.priceRate.selectAllPriceRate);

  const balance = useMemo(() => {
    return priceRate
      .getCurrentBalance(filteredCurrencies, baseCurrency, pricesRate)
      .toFixed(FIXED_NUMBER[baseCurrency]);
  }, [baseCurrency, filteredCurrencies, pricesRate]);

  const renderValue = useMemo(() => {
    if (operation.type === 'exchange') {
      return (
        <Exchange>
          <Wrapper>
            <Icon currency={currencyFrom || ''} width={30} height={30} />
            <Text variant="title18Medium">{`${shorteredValue(operation.amountFrom)} ${currencyFrom}`}</Text>
          </Wrapper>
          <Separator />
          <Wrapper>
            <Icon currency={currencyTo || ''} width={30} height={30} />
            <Text variant="title18Medium">{`${shorteredValue(operation.amountTo)} ${currencyTo}`}</Text>
          </Wrapper>
        </Exchange>
      );
    } else if (operation.type === 'withdrawal') {
      return (
        <>
          <Icon currency={currencyFrom || ''} width={30} height={30} />
          <Text variant="title18Medium">{`-${shorteredValue(operation.amountFrom)} ${currencyFrom}`}</Text>
        </>
      );
    } else {
      return (
        <>
          <Icon currency={currencyTo || ''} width={30} height={30} />
          <Text variant="title18Medium">{`+${shorteredValue(operation.amountTo)} ${currencyTo}`}</Text>
        </>
      );
    }
  }, [currencyFrom, currencyTo, operation]);

  return (
    <Main>
      <Section>
        <Text variant="title16Bold">{transactionInfo.currencyExchange}</Text>
        <Row $margin="16px" $isСurrencies>
          {renderValue}
        </Row>
      </Section>
      <Row>
        <TextWrapper>
          <Text variant="title16Bold">{transactionInfo.commission}</Text>
        </TextWrapper>
        <Text variant="title16Bold">{operation.commission || 0}</Text>
      </Row>
      <Row>
        <TextWrapper>
          <Text variant="title16Bold">{transactionInfo.assetValue}</Text>
        </TextWrapper>
        <TextGreen variant="title16Bold">
          {balance} {baseCurrency}
        </TextGreen>
      </Row>
    </Main>
  );
};

type RowProps = {
  $margin?: string;
  $isСurrencies?: boolean;
};

const Main = styled.View`
  margin-bottom: 10px;
`;

const Section = styled.View`
  margin-top: 24px;
`;

const Exchange = styled.View`
  flex: 1;
`;

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Row = styled.View<RowProps>`
  flex-direction: row;
  align-items: center;
  margin-top: ${({ $margin }) => ($margin ? $margin : '24px')};
  ${({ $isСurrencies }) => !$isСurrencies && 'justify-content: space-between'};
`;

const TextWrapper = styled.View`
  flex: 1;
`;

const Text = styled(AppText)``;

const TextGreen = styled(AppText)`
  color: ${({ theme: { colors } }) => colors.accentGreen};
`;

const Icon = styled(CurrencyIcon)`
  margin-right: 4px;
`;

export default FiatAndExchangeOperations;
