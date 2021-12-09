import { TransactionAllInformation } from '__generated__/types';
import { ErrorIcon, InProgressIcon, SuccessIcon } from 'assets/svgs';
import { useGetMeCurrencies } from 'common/queries/__generated__/get-me-currencies.query';
import { useTypedTranslation } from 'hooks';
import { TranslationObject } from 'libs/i18n';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Operations, Status } from 'types';
import { AppText, Loader } from 'ui';
import { filterOperations, shorteredValue } from 'utils';

import ModalForOperations from '../ModalForOperations';

type OperationsItemProps = {
  operation: TransactionAllInformation;
};

export const statusIconMapping: Record<Status, React.ReactNode> = {
  pending: <InProgressIcon />,
  init: <InProgressIcon />,
  processed: <SuccessIcon />,
  error: <ErrorIcon />,
  rejected: <ErrorIcon />,
};

const OperationsItem: React.FC<OperationsItemProps> = ({ operation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const transactions = useTypedTranslation<TranslationObject['utils']['transactions']>('utils.transactions');
  const { data, loading } = useGetMeCurrencies({
    fetchPolicy: 'cache-only',
  });
  const fullData = [...(data?.currencies || []), ...(data?.fetchDexCurrencies || [])];
  const type: Operations = operation.type as Operations;
  const status: Status = operation.status as Status;
  const currencyFrom = fullData.find((item) => item.id === operation.currencyFrom)?.currency;
  const currencyTo = fullData.find((item) => item.id === operation.currencyTo)?.currency;

  const renderValue = () => {
    if ((currencyFrom && currencyTo) || currencyTo) {
      return `+${shorteredValue(operation.amountTo)} ${currencyTo}`;
    } else {
      return `-${shorteredValue(operation.amountFrom)} ${currencyFrom}`;
    }
  };

  return (
    <>
      <Root activeOpacity={0.8} onPress={() => setIsModalVisible(true)}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <IconWrapper>{filterOperations(operation, 'icon')}</IconWrapper>
            <TextWrapper>
              <Text variant="title18Medium">{filterOperations(operation, 'text', transactions)}</Text>
              {type === 'exchange' && <Subtext variant="bodyBold">{`${currencyFrom} > ${currencyTo}`}</Subtext>}
            </TextWrapper>
            <ValueWrapper>
              <StatusWrapper>
                <Text variant="title18Medium">{renderValue()}</Text>
                {statusIconMapping[status]}
              </StatusWrapper>

              {type === 'exchange' && (
                <Subtext variant="bodyBold">{`-${shorteredValue(operation.amountFrom)} ${currencyFrom}`}</Subtext>
              )}
            </ValueWrapper>
          </>
        )}
      </Root>
      {isModalVisible && (
        <ModalForOperations
          operation={operation}
          closeModal={() => setIsModalVisible(false)}
          isModalVisible={isModalVisible}
          fullData={fullData}
        />
      )}
    </>
  );
};

const Root = styled.TouchableOpacity`
  padding: 12px 0px;
  border-top-width: 1px;
  border-top-color: ${({ theme: { colors } }) => colors.secondaryLightGrey};
  flex-direction: row;
  align-items: center;
`;

const TextWrapper = styled.View`
  flex: 1;
`;

const Text = styled(AppText)`
  margin-right: 4px;
`;

const Subtext = styled(AppText)`
  color: ${({ theme: { colors } }) => colors.secondaryDarkGrey};
  margin-top: 4px;
`;

const ValueWrapper = styled.View`
  margin-left: auto;
  align-items: flex-end;
`;

const StatusWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconWrapper = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.bgLightBlue};
  margin-right: 8px;
`;

export default OperationsItem;
