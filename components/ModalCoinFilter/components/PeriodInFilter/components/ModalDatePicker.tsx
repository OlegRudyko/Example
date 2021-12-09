import { useTypedTranslation } from 'hooks';
import { TranslationObject } from 'libs/i18n';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import styled from 'styled-components/native';
import { AppText } from 'ui';
import { transformDateForFilter } from 'utils/transformDate';

import { Position } from '../Period';
import DatePickerInput from './DatePickerInput';

export type PickerValue = {
  from: Date | null;
  to: Date | null;
};

type ModalDatePickerProps = {
  changeActivePosition: (pos: Position) => void;
  activePosition: Position;
  datePickersValue: PickerValue;
  setDatePickersValue: ({ from, to }: PickerValue) => void;
  modalVisible: boolean;
  closeModal: () => void;
};

const ModalDatePicker: React.FC<ModalDatePickerProps> = ({
  modalVisible,
  changeActivePosition,
  activePosition,
  datePickersValue,
  setDatePickersValue,
  closeModal,
}) => {
  const [_datePickersValue, _setDatePickersValue] = useState<PickerValue>(datePickersValue);
  const { i18n } = useTranslation();
  const periodInFilter = useTypedTranslation<TranslationObject['ui']['periodInFilter']>('ui.periodInFilter');

  useEffect(() => {
    if (!datePickersValue.to && !datePickersValue.from) {
      _setDatePickersValue(datePickersValue);
    }
  }, [datePickersValue]);

  const submit = () => {
    if (!_datePickersValue[activePosition]) {
      const value = {
        ..._datePickersValue,
        [activePosition]: new Date(),
      };
      _setDatePickersValue(value);
      setDatePickersValue(value);
    } else {
      setDatePickersValue(_datePickersValue);
    }
    closeModal();
  };

  const cancel = () => {
    _setDatePickersValue(datePickersValue);
    closeModal();
  };

  const dateChange = (date: Date) => {
    let value: any = {};
    if (
      activePosition === 'from' &&
      _datePickersValue.to &&
      transformDateForFilter(date) > transformDateForFilter(_datePickersValue.to)
    ) {
      value = {
        ..._datePickersValue,
        [activePosition]: _datePickersValue.to,
      };
    } else if (
      activePosition === 'to' &&
      _datePickersValue.from &&
      transformDateForFilter(date) < transformDateForFilter(_datePickersValue.from)
    ) {
      value = {
        ..._datePickersValue,
        [activePosition]: _datePickersValue.from,
      };
    } else {
      value = {
        ..._datePickersValue,
        [activePosition]: date,
      };
    }
    _setDatePickersValue(value);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <Root>
        <Wrapper>
          <Header>
            <TouchableOpacity onPress={cancel}>
              <Cancel variant="bodyMedium">{periodInFilter.modal.cancel}</Cancel>
            </TouchableOpacity>
            <Title variant="title16Bold">{periodInFilter.modal.title}</Title>
            <TouchableOpacity onPress={submit}>
              <Submit variant="bodyMedium">{periodInFilter.modal.submit}</Submit>
            </TouchableOpacity>
          </Header>
          <Main>
            <DatePickerInput
              activePosition={activePosition}
              changeActivePosition={changeActivePosition}
              datePickersValue={_datePickersValue}
              position="from"
            />
            <Text variant="bodyMedium">{periodInFilter.modal.to}</Text>
            <DatePickerInput
              activePosition={activePosition}
              changeActivePosition={changeActivePosition}
              datePickersValue={_datePickersValue}
              position="to"
            />
          </Main>
          <DatePickerWrapper>
            <DatePicker
              locale={i18n.language}
              androidVariant="iosClone"
              mode="date"
              date={_datePickersValue[activePosition] || new Date()}
              onDateChange={dateChange}
              maximumDate={new Date()}
              minimumDate={new Date('2000-01-01')}
            />
          </DatePickerWrapper>
        </Wrapper>
      </Root>
    </Modal>
  );
};

const Root = styled.View`
  flex: 1;
`;

const Wrapper = styled.View`
  margin-top: auto;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: ${({ theme: { colors } }) => colors.primaryWhite};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 18px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme: { colors } }) => colors.secondaryLightGrey};
`;

const Cancel = styled(AppText)`
  color: ${({ theme: { colors } }) => colors.secondaryDarkGrey};
`;

const Title = styled(AppText)``;

const Submit = styled(AppText)`
  color: ${({ theme: { colors } }) => colors.primaryBlue};
`;

const Text = styled(AppText)``;

const Main = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
`;

const DatePickerWrapper = styled.View`
  align-items: center;
`;

export default ModalDatePicker;
