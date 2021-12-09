import { TranslationObject } from 'libs/i18n';
import React from 'react';
import { StyleSheet } from 'react-native';
import HTMLView from 'react-native-htmlview';
import styled from 'styled-components/native';
import { AppText } from 'ui';

type AboutCoinProps = {
  coin: TranslationObject['screens']['coin'];
  info: any;
  alias: string;
  contract: string | null;
};

const AboutCoin: React.FC<AboutCoinProps> = ({ coin, info, alias, contract }) => {
  return (
    <MainToken>
      {!info.success && !contract ? (
        <EmptyInfo variant="title16Medium">{coin.tabs.about.emptyInfo}</EmptyInfo>
      ) : (
        <>
          {info.content && (
            <TextBlock margin>
              <BoldText variant="title18Bold">{alias}</BoldText>
              <HTMLView value={`<div>${info.content}</div>`} stylesheet={styles} />
            </TextBlock>
          )}
          {info.official_url && (
            <TextBlock margin>
              <BoldText variant="title18Bold">{coin.tabs.about.site}</BoldText>
              <Text variant="bodyRegular">{info.official_url}</Text>
            </TextBlock>
          )}
          {contract && (
            <TextBlock>
              <BoldText variant="title18Bold">{coin.tabs.about.smartContract}</BoldText>
              <Text variant="bodyRegular">{contract}</Text>
            </TextBlock>
          )}
        </>
      )}
    </MainToken>
  );
};

const styles = StyleSheet.create({
  div: {
    fontFamily: 'PTRootUI-Regular',
  },
  p: {
    fontSize: 14,
    lineHeight: 18,
  },
  h3: {
    fontSize: 18,
    fontWeight: '700',
  },
  h2: {
    fontSize: 20,
    fontWeight: '700',
  },
  h1: {
    fontSize: 22,
    fontWeight: '700',
  },
});

const MainToken = styled.View`
  margin-top: 18px;
  padding: 12px;
  border-radius: 12px;
  background-color: ${({ theme: { colors } }) => colors.bgLightBlue};
`;

const EmptyInfo = styled(AppText)`
  margin: 40px auto;
  text-align: center;
`;

const TextBlock = styled.View<{ margin?: boolean }>`
  ${({ margin }) => margin && 'margin-bottom: 18px'};
`;

const BoldText = styled(AppText)`
  margin-bottom: 8px;
`;

const Text = styled(AppText)``;

export default AboutCoin;
