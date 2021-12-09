import { TransactionAllInformation } from '__generated__/types';
import { CloseIcon } from 'assets/svgs';
import { useTypedTranslation } from 'hooks';
import { TranslationObject } from 'libs/i18n';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import { TypeOperations } from 'types';
import { AppButton, AppText } from 'ui';
import { historyFilter } from 'utils/historyFilter';

import { ButtonsBlock, CurrencyBlock, CurrencyList, PeriodInFilter } from './components';
import { PickerValue } from './components/PeriodInFilter/components/ModalDatePicker';

type ModalCoinFilterProps = {
  isModalVisible: boolean;
  closeModal: () => void;
  operations: TransactionAllInformation[];
  setOperations: (val: TransactionAllInformation[]) => void;
  isSingleCurrency?: boolean;
  setFilterOn: (val: boolean) => void;
};

const ModalCoinFilter: React.FC<ModalCoinFilterProps> = ({
  isModalVisible,
  closeModal,
  operations,
  setOperations,
  isSingleCurrency,
  setFilterOn,
}) => {
  const [datePickersValue, setDatePickersValue] = useState<PickerValue>({ from: null, to: null });
  const [type, setType] = useState<TypeOperations>('');
  const [status, setStatus] = useState('');
  const [currency, setCurrency] = useState<{ alias: string; id: number }[]>([]);
  const [isListModalVisible, setIsListModalVisible] = useState(false);
  const transactionsFilter = useTypedTranslation<TranslationObject['components']['transactionsFilter']>(
    'components.transactionsFilter',
  );
  const transactions = useTypedTranslation<TranslationObject['utils']['transactions']>('utils.transactions');
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const onSubmit = () => {
    const filteredCurrency = currency.map((item) => item.id);

    setOperations(historyFilter(operations, datePickersValue, type, status, filteredCurrency));
    setFilterOn(
      Boolean(currency.length) ||
        Boolean(status) ||
        Boolean(type) ||
        (Boolean(datePickersValue.from) && Boolean(datePickersValue.to)),
    );
    closeModal();
  };

  const reset = () => {
    setCurrency([]);
    setType('');
    setStatus('');
    setDatePickersValue({ from: null, to: null });
  };

  return (
    <Modal style={{ margin: 0 }} onBackdropPress={closeModal} isVisible={isModalVisible}>
      <Root style={{ paddingBottom: insets.bottom }}>
        <Header>
          <Empty />
          <Title variant="title18Bold">{transactionsFilter.title}</Title>
          <TouchableOpacity onPress={closeModal}>
            <CloseIcon fill={theme.colors.primaryBlack} />
          </TouchableOpacity>
        </Header>
        <ButtonsBlock
          title={transactionsFilter.status.title}
          arr={Object.entries(transactionsFilter.status.value)}
          value={status}
          setValue={setStatus}
        />
        <PeriodInFilter datePickersValue={datePickersValue} setDatePickersValue={setDatePickersValue} />
        <ButtonsBlock
          title={transactionsFilter.type.caption}
          arr={Object.entries(transactions)}
          value={type}
          setValue={setType}
        />
        {!isSingleCurrency && (
          <CurrencyBlock
            openModal={() => setIsListModalVisible(true)}
            resetCurrency={() => setCurrency([])}
            currency={currency}
            transactionsFilter={transactionsFilter}
          />
        )}
        <Wrapper>
          <ButtonCancle isSquareBorder variant="secondary" label={transactionsFilter.buttons.reset} onPress={reset} />
          <ButtonSuccess isSquareBorder label={transactionsFilter.buttons.success} onPress={onSubmit} />
        </Wrapper>
      </Root>
      {isListModalVisible && (
        <CurrencyList
          isModalVisible={isListModalVisible}
          closeModal={() => setIsListModalVisible(false)}
          list={currency}
          setList={setCurrency}
        />
      )}
    </Modal>
  );
};

const Root = styled.View`
  margin-top: auto;
  padding: 0px 16px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: ${({ theme: { colors } }) => colors.primaryWhite};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 18px 0px;
`;

const Title = styled(AppText)``;

const Empty = styled.View`
  width: 24px;
  height: 24px;
`;

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ButtonCancle = styled(AppButton)`
  flex: 1;
  margin-right: 8px;
`;

const ButtonSuccess = styled(AppButton)`
  flex: 1;
`;

export default ModalCoinFilter;
