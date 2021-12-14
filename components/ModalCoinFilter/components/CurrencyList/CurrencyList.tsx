import { useTypedTranslation } from 'hooks';
import { DefaultLayout, NestedHeader } from 'layouts';
import { TranslationObject } from 'libs/i18n';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { selectors } from 'store';
import styled from 'styled-components/native';
import { AppButton, AppText } from 'ui';

import ListItem from './components/ListItem';

type List = { alias: string; id: number };

type CurrencyListProps = {
  isModalVisible: boolean;
  closeModal: () => void;
  setList: (val: List[]) => void;
  list: List[];
};

const CurrencyList: React.FC<CurrencyListProps> = ({ list, setList, closeModal, isModalVisible }) => {
  const [_list, _setList] = useState<List[]>(list);
  const transactionsFilter = useTypedTranslation<TranslationObject['components']['transactionsFilter']>(
    'components.transactionsFilter',
  );
  const fullData = useSelector(selectors.currencies.selectAllCurrenciesList);

  const renderResetButton = () => {
    return (
      <TouchableOpacity onPress={() => _setList([])}>
        <Reset variant="bodyMedium">{transactionsFilter.currencies.reset}</Reset>
      </TouchableOpacity>
    );
  };

  const selectCurrency = (val: List) => {
    const includes = !!_list.find((_item) => _item.alias === val.alias);

    if (includes) {
      _setList(_list.filter((item) => item.alias !== val.alias));
    } else {
      _setList([..._list, val]);
    }
  };

  const onSubmit = () => {
    setList(_list);
    closeModal();
  };

  return (
    <Modal isVisible={isModalVisible} style={{ margin: 0 }}>
      <DefaultLayout>
        <NestedHeader
          goBack={closeModal}
          withBack
          title={transactionsFilter.currencies.caption}
          renderRightElement={renderResetButton}
        />
        <Main>
          {fullData.map((item) => {
            if (item.isFiat) {
              return null;
            }

            const isSelected = !!_list.find((_item) => _item.alias === item.alias);
            return (
              <ListItem
                key={item.id}
                id={item.id}
                selected={selectCurrency}
                isSelected={isSelected}
                alias={item.alias}
                currency={item.currency}
              />
            );
          })}
        </Main>
        <Button onPress={onSubmit} label={transactionsFilter.buttons.success} />
      </DefaultLayout>
    </Modal>
  );
};

const Reset = styled(AppText)`
  margin-left: 16px;
  color: ${({ theme: { colors } }) => colors.primaryBlue};
`;

const Main = styled.ScrollView`
  flex: 1;
`;

const Button = styled(AppButton)`
  margin: 16px 0 0 0;
`;

export default CurrencyList;
