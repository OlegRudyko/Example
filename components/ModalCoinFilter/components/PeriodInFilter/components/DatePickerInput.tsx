import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { AppText } from 'ui';

import { Position } from '../Period';
import { PickerValue } from './ModalDatePicker';

type DatePickerInputProps = {
  changeActivePosition: (pos: Position) => void;
  position: Position;
  activePosition?: Position;
  datePickersValue: PickerValue;
};

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  changeActivePosition,
  position,
  activePosition,
  datePickersValue,
}) => {
  const { i18n } = useTranslation();
  const isActive = activePosition === position ? true : false;

  const formatDate = (date: Date | null) => {
    if (!date) {
      return '-';
    }
    let day: string | number = date.getDate();
    let month: string | number = date.getMonth() + 1;
    const year = date.getFullYear();

    if (day.toString().length < 2) {
      day = '0' + day;
    }
    if (month.toString().length < 2) {
      month = '0' + month;
    }

    return i18n.language === 'ru' ? `${day}-${month}-${year}` : `${month}-${day}-${year}`;
  };

  return (
    <Root activeOpacity={0.8} onPress={() => changeActivePosition(position)}>
      <Text variant="bodyMedium" $isActive={isActive}>
        {formatDate(datePickersValue[position])}
      </Text>
    </Root>
  );
};

type TextProps = {
  $isActive: boolean;
};

const Root = styled.TouchableOpacity`
  height: 32px;
  width: 154px;
  background-color: ${({ theme: { colors } }) => colors.secondaryActive};
  justify-content: center;
  align-items: center;
`;

const Text = styled(AppText)<TextProps>`
  color: ${({ theme: { colors }, $isActive }) => ($isActive ? colors.primaryBlue : colors.primaryBlackText)};
`;

export default DatePickerInput;
