import { TranslationObject } from 'libs/i18n';
import React from 'react';
import { Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import styled from 'styled-components/native';
import { Language } from 'types';
import { AppText, SkeletonContainer } from 'ui';

import CoinChart from './CoinChart';

type AboutCoinProps = {
  currency: string;
  locale: Language;
  symbol: 'USD' | 'RUB';
  coin: TranslationObject['screens']['coin'];
  info: any;
  transformValue: (val: number, locale: Language) => string;
  isLoadInfo: boolean;
};

const IDENT_SKELETON = 20;

const AboutCoin: React.FC<AboutCoinProps> = ({ currency, locale, symbol, coin, info, transformValue, isLoadInfo }) => {
  const { width } = Dimensions.get('screen');

  return (
    <MainCoin>
      <CoinChart currency={currency} />
      {isLoadInfo && (
        <SkeletonContainer>
          <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" marginBottom={8} marginTop={8}>
            <SkeletonPlaceholder.Item width={width / 2 - IDENT_SKELETON} height={100} borderRadius={12} />
            <SkeletonPlaceholder.Item width={width / 2 - IDENT_SKELETON} height={100} borderRadius={12} />
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" width="100%">
            <SkeletonPlaceholder.Item width={width / 2 - IDENT_SKELETON} height={100} borderRadius={12} />
            <SkeletonPlaceholder.Item width={width / 2 - IDENT_SKELETON} height={100} borderRadius={12} />
          </SkeletonPlaceholder.Item>
        </SkeletonContainer>
      )}
      {!isLoadInfo && info !== undefined && (
        <>
          <InfoRow>
            <InfoItem style={{ marginRight: 8 }}>
              <Text variant="bodyRegular">{coin.tabs.about.capitalization}</Text>
              <BoldText variant="title18Bold">{transformValue(info && info.capitalization[symbol], locale)}</BoldText>
            </InfoItem>
            <InfoItem>
              <Text variant="bodyRegular">{coin.tabs.about.volume}</Text>
              <BoldText variant="title18Bold">{transformValue(info && info.volume_24h[symbol], locale)}</BoldText>
            </InfoItem>
          </InfoRow>
          <InfoRow>
            <InfoItem style={{ marginRight: 8 }}>
              <Text variant="bodyRegular">{coin.tabs.about.maximum}</Text>
              <BoldText variant="title18Bold">{transformValue(info && info.history_max[symbol], locale)}</BoldText>
            </InfoItem>
            <InfoItem>
              <Text variant="bodyRegular">{coin.tabs.about.rating}</Text>
              <BoldText variant="title18Bold">#{info && info.rate}</BoldText>
            </InfoItem>
          </InfoRow>
        </>
      )}
    </MainCoin>
  );
};

const MainCoin = styled.View`
  margin-top: 24px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  margin-top: 8px;
`;

const InfoItem = styled.View`
  flex: 1;
  padding: 12px 30px 12px 12px;
  border-radius: 12px;
  background-color: ${({ theme: { colors } }) => colors.bgLightBlue};
`;

const BoldText = styled(AppText)`
  margin-top: 8px;
`;

const Text = styled(AppText)``;

export default AboutCoin;
