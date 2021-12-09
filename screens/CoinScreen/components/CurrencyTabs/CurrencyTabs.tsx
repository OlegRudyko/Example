import { Currencies } from '__generated__/types';
import { useTypedTranslation } from 'hooks';
import { TranslationObject } from 'libs/i18n';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { AppText } from 'ui';

import AboutCurrency from './AboutCurrency';
import History from './History';

type Tabs = 'about' | 'history';

type CurrencyTabsProps = {
  currency: Currencies;
  operations: any;
  coinInfo: any;
};

const CurrencyTabs: React.FC<CurrencyTabsProps> = ({ currency, operations, coinInfo }) => {
  const [currentTab, setCurrentTab] = useState<Tabs>('about');
  const coin = useTypedTranslation<TranslationObject['screens']['coin']>('screens.coin');
  const contract = currency.hidden && currency.networkData[0] ? currency.networkData[0].rules.contract : null;

  return (
    <>
      <TabsWrapper>
        <TabButton isActive={currentTab === 'about'} activeOpacity={0.9} onPress={() => setCurrentTab('about')}>
          <Tab variant={currentTab === 'about' ? 'title18Bold' : 'title18Medium'} isActive={currentTab === 'about'}>
            {coin.tabs.about.title}
          </Tab>
        </TabButton>
        <TabButton isActive={currentTab === 'history'} activeOpacity={0.9} onPress={() => setCurrentTab('history')}>
          <Tab variant={currentTab === 'history' ? 'title18Bold' : 'title18Medium'} isActive={currentTab === 'history'}>
            {coin.tabs.history.title}
          </Tab>
        </TabButton>
      </TabsWrapper>
      {currentTab === 'about' ? (
        <AboutCurrency
          contract={contract}
          alias={currency.alias}
          token={currency.hidden}
          currency={currency.currency}
          info={coinInfo}
        />
      ) : (
        <History data={operations} currencyId={currency.id} />
      )}
    </>
  );
};

type TabProps = {
  isActive: boolean;
};

const TabsWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 22px;
`;

const TabButton = styled.TouchableOpacity<TabProps>`
  padding-bottom: 4px;
  margin-right: 18px;
  ${({ isActive }) => isActive && 'border-bottom-width: 2px'};
  border-bottom-color: ${({ theme: { colors } }) => colors.primaryBlack};
`;

const Tab = styled(AppText)<TabProps>`
  color: ${({ theme: { colors }, isActive }) => (isActive ? colors.primaryBlackText : '#AAAAAA')};
`;

export default CurrencyTabs;
