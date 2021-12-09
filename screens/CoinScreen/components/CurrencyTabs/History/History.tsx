import { TransactionAllInformation } from '__generated__/types';
import { FilterOffIcon, FilterOnIcon } from 'assets/svgs';
import { ModalCoinFilter } from 'components';
import OperationsHistory from 'components/OperationsHistory';
import { useTypedTranslation } from 'hooks';
import { TranslationObject } from 'libs/i18n';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { AppButton } from 'ui';
import { filtering } from 'utils';

type HistoryProps = {
  currencyId: number;
  data: TransactionAllInformation[];
};

const History: React.FC<HistoryProps> = ({ currencyId, data }) => {
  const [operations, setOperations] = useState<TransactionAllInformation[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterOn, setFilterOn] = useState(false);
  const coin = useTypedTranslation<TranslationObject['screens']['coin']>('screens.coin');

  const getOneCoinOperations = (data: TransactionAllInformation[]) => {
    return data.filter((item) => filtering.filteredOperations(item, currencyId));
  };

  useEffect(() => {
    if (data) {
      setOperations(getOneCoinOperations(data));
    }
  }, [data]);

  const coinOperations = getOneCoinOperations(data || []);

  return (
    <Root>
      <Button
        icon={filterOn ? <FilterOnIcon /> : <FilterOffIcon />}
        onPress={() => setIsModalVisible(true)}
        label={coin.tabs.history.filterButton}
        variant="secondary"
      />
      <OperationsHistory operations={operations} />
      <ModalCoinFilter
        isModalVisible={isModalVisible}
        closeModal={() => setIsModalVisible(false)}
        operations={coinOperations}
        setOperations={setOperations}
        setFilterOn={setFilterOn}
        isSingleCurrency
      />
    </Root>
  );
};

const Root = styled.View``;

const Button = styled(AppButton)`
  margin-top: 18px;
`;

export default History;
