import { Currencies, TransactionAllInformation } from '__generated__/types';
import { useTypedTranslation } from 'hooks';
import { TranslationObject } from 'libs/i18n';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Language, Status } from 'types';
import { AppText } from 'ui';
import { filterOperations, transformDate } from 'utils';

import { statusIconMapping } from '../OperationsItem/OperationsItem';
import { DepositAndWithdrawalOperations, FiatAndExchangeOperations } from './components';

type ModalForOperationsProps = {
  isModalVisible: boolean;
  closeModal: () => void;
  operation: TransactionAllInformation;
  fullData: Currencies[];
};

const ModalForOperations: React.FC<ModalForOperationsProps> = ({ fullData, isModalVisible, closeModal, operation }) => {
  const { i18n } = useTranslation();
  const transactions = useTypedTranslation<TranslationObject['utils']['transactions']>('utils.transactions');
  const statusesFull = useTypedTranslation<TranslationObject['utils']['statusesFull']>('utils.statusesFull');
  const status: Status = operation.status as Status;
  const locale = i18n.language as Language;
  const insets = useSafeAreaInsets();
  const typeOperations = filterOperations(operation, 'type');

  return (
    <Modal
      style={{ margin: 0 }}
      onSwipeComplete={closeModal}
      onBackdropPress={closeModal}
      swipeDirection="down"
      isVisible={isModalVisible}
    >
      <Root style={{ paddingBottom: insets.bottom }}>
        <Indicator />
        <Header>
          <Date variant="bodyRegular">{transformDate(+operation.createdAt, locale, true)}</Date>
          <IconWrapper>{filterOperations(operation, 'icon')}</IconWrapper>
          <Title variant="title18Bold">{filterOperations(operation, 'text', transactions)}</Title>
          <StatusWrapper>
            {statusIconMapping[status]}
            <StatusText variant="bodyRegular">{statusesFull[status]}</StatusText>
          </StatusWrapper>
        </Header>
        {typeOperations === 'withdrawal' || typeOperations === 'deposit' || typeOperations === 'bonus' ? (
          <DepositAndWithdrawalOperations fullData={fullData} operation={operation} />
        ) : (
          <FiatAndExchangeOperations fullData={fullData} operation={operation} />
        )}
      </Root>
    </Modal>
  );
};

const Root = styled.View`
  margin-top: auto;
  background-color: ${({ theme: { colors } }) => colors.primaryWhite};
  padding: 0px 16px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const Indicator = styled.View`
  background-color: #d8dde4;
  border-radius: 100px;
  width: 40px;
  height: 4px;
  margin: 8px auto 24px auto;
`;

const Header = styled.View`
  align-items: center;
`;

const Date = styled(AppText)`
  margin-bottom: 18px;
`;

const IconWrapper = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.bgLightBlue};
  margin-bottom: 8px;
`;

const Title = styled(AppText)`
  margin-bottom: 16px;
`;

const StatusText = styled(AppText)`
  margin-left: 8px;
`;

const StatusWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export default ModalForOperations;
