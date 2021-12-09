import { useTypedTranslation } from 'hooks';
import { TranslationObject } from 'libs/i18n';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { AppText } from 'ui';

import DatePickerInput from './components/DatePickerInput';
import ModalDatePicker, { PickerValue } from './components/ModalDatePicker';

export type Position = 'from' | 'to';

type PeriodProps = {
  datePickersValue: PickerValue;
  setDatePickersValue: ({ from, to }: PickerValue) => void;
};

const Period: React.FC<PeriodProps> = ({ datePickersValue, setDatePickersValue }) => {
  const [activePosition, setActivePosition] = useState<Position>('from');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = (pos: Position) => {
    setActivePosition(pos);
    setIsModalVisible(true);
  };

  const periodInFilter = useTypedTranslation<TranslationObject['ui']['periodInFilter']>('ui.periodInFilter');

  return (
    <>
      <Root>
        <Header>
          <Title variant="title18Bold">{periodInFilter.period.title}</Title>
        </Header>
        <Main>
          <DatePickerInput changeActivePosition={openModal} datePickersValue={datePickersValue} position="from" />
          <Text variant="bodyMedium">{periodInFilter.period.to}</Text>
          <DatePickerInput changeActivePosition={openModal} datePickersValue={datePickersValue} position="to" />
        </Main>
      </Root>
      <ModalDatePicker
        modalVisible={isModalVisible}
        closeModal={() => setIsModalVisible(false)}
        activePosition={activePosition}
        changeActivePosition={setActivePosition}
        datePickersValue={datePickersValue}
        setDatePickersValue={setDatePickersValue}
      />
    </>
  );
};

const Root = styled.View`
  margin-bottom: 18px;
`;

const Header = styled.View`
  padding-bottom: 4px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme: { colors } }) => colors.secondaryLightGrey};
`;

const Title = styled(AppText)``;

const Main = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
`;

const Text = styled(AppText)``;

export default Period;
