import { Currencies, TransactionAllInformation } from '__generated__/types';
import { CurrencyIcon } from 'components';
import { useTypedTranslation } from 'hooks';
import { TranslationObject } from 'libs/i18n';
import React from 'react';
import styled from 'styled-components/native';
import { AppText } from 'ui';
import { shorteredValue } from 'utils';

type DepositAndWithdrawalOperationsProps = {
  operation: TransactionAllInformation;
  fullData: Currencies[];
};

const DepositAndWithdrawalOperations: React.FC<DepositAndWithdrawalOperationsProps> = ({ operation, fullData }) => {
  const transactionInfo =
    useTypedTranslation<TranslationObject['components']['transactionInfo']>('components.transactionInfo');
  const type = operation.type;
  const currencyFrom = fullData.find((item) => item.id === operation.currencyFrom)?.currency;
  const currencyTo = fullData.find((item) => item.id === operation.currencyTo)?.currency;

  const renderValue = () => {
    if (currencyTo) {
      return `+${shorteredValue(operation.amountTo)} ${currencyTo}`;
    } else {
      return `-${shorteredValue(operation.amountFrom)} ${currencyFrom}`;
    }
  };

  const currency = currencyFrom || currencyTo || '';

  return (
    <Main>
      <Section>
        <Text variant="title16Bold">{transactionInfo.currencyAccrual}</Text>
        <Row $margin="16px" $isСurrencies>
          <Icon currency={currency} width={30} height={30} />
          <Text variant="title18Medium">{renderValue()}</Text>
        </Row>
      </Section>
      {type !== 'bonus_deposit' && (
        <Section>
          <Text variant="title16Bold">
            {type === 'withdrawal' ? transactionInfo.addressRecipient : transactionInfo.addressSender}
          </Text>
          <Row $margin="16px">
            <TextGray variant="title16Medium">
              {type === 'deposit' ? operation.addressFrom : operation.addressTo}
            </TextGray>
          </Row>
        </Section>
      )}
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

const Row = styled.View<RowProps>`
  flex-direction: row;
  align-items: center;
  margin-top: ${({ $margin }) => ($margin ? $margin : '24px')};
  ${({ $isСurrencies }) => !$isСurrencies && 'justify-content: space-between'};
`;

const Text = styled(AppText)``;

const TextGray = styled(AppText)`
  color: ${({ theme: { colors } }) => colors.secondaryDarkGrey};
`;

const Icon = styled(CurrencyIcon)`
  margin-right: 4px;
`;

export default DepositAndWithdrawalOperations;
