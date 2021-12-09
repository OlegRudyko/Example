import { TransactionAllInformation } from '__generated__/types';
import { useTypedTranslation } from 'hooks';
import { TranslationObject } from 'libs/i18n';
import { groupBy as lodashGroupBy } from 'lodash';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { Language } from 'types';
import { AppText, EmptyContainer } from 'ui';
import { filterOperations, transformDate } from 'utils';

import OperationsItem from './components/OperationsItem/OperationsItem';

interface OperationsHistoryProps {
  operations: TransactionAllInformation[];
}

const OperationsHistory: FC<OperationsHistoryProps> = ({ operations }) => {
  const { i18n } = useTranslation();
  const coin = useTypedTranslation<TranslationObject['screens']['coin']>('screens.coin');
  const locale = i18n.language as Language;

  const historyElements = useMemo(() => {
    if (!operations.length) {
      return <EmptyContainer description={coin.tabs.history.emptyHistory} />;
    }

    const _operations = [...operations];
    _operations.sort((a, b) => +b.createdAt - +a.createdAt);

    const operationsByDate = lodashGroupBy(_operations, (operation) => transformDate(+operation.createdAt, locale));

    const nestedResult = Object.values(operationsByDate).map((operations) => {
      const date = +operations[0].createdAt;
      const sectionOne = operations.filter((item) => {
        const typeOperations = filterOperations(item, 'type');
        return typeOperations === 'exchange' || typeOperations === 'fiatWithdrawal' || typeOperations === 'fiatDeposit';
      });
      const sectionTwo = operations.filter((item) => {
        const typeOperations = filterOperations(item, 'type');
        return typeOperations === 'withdrawal' || typeOperations === 'deposit' || typeOperations === 'bonus';
      });
      const transDate = transformDate(date, locale);

      return (
        <Main key={date * Math.random()}>
          {Boolean(sectionOne.length) && (
            <Section>
              <Dates variant="title18Medium">{transDate}</Dates>
              {sectionOne.map((item) => {
                return <OperationsItem key={item.id * Math.random()} operation={item} />;
              })}
            </Section>
          )}
          {Boolean(sectionTwo.length) && (
            <Section>
              <Dates variant="title18Medium">{transDate}</Dates>
              {sectionTwo.map((item) => {
                return <OperationsItem key={item.id * Math.random()} operation={item} />;
              })}
            </Section>
          )}
        </Main>
      );
    });

    return nestedResult;
  }, [coin.tabs.history.emptyHistory, locale, operations]);

  return <>{historyElements}</>;
};

const Main = styled.View``;

const Section = styled.View`
  margin-top: 12px;
`;

const Dates = styled(AppText)`
  margin-bottom: 12px;
`;

export default OperationsHistory;
