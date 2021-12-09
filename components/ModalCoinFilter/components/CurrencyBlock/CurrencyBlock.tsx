import { ArrowGrayRight } from 'assets/svgs';
import { TranslationObject } from 'libs/i18n';
import React from 'react';
import styled from 'styled-components/native';
import { AppText } from 'ui';

type CurrencyBlockProps = {
  currency: { alias: string; id: number }[];
  transactionsFilter: TranslationObject['components']['transactionsFilter'];
  openModal: () => void;
  resetCurrency: () => void;
};

const CurrencyBlock: React.FC<CurrencyBlockProps> = ({ currency, transactionsFilter, resetCurrency, openModal }) => {
  return (
    <Block>
      <HeaderBlock>
        <Title variant="title18Bold">{transactionsFilter.currencies.caption}</Title>
      </HeaderBlock>
      <CurrencyButton onPress={openModal}>
        <List numberOfLines={1} variant="bodyMedium">
          {currency.length ? currency.map((item) => item.alias).join(', ') : transactionsFilter.currencies.all}
        </List>
        {currency.length ? (
          <ResetButton onPress={resetCurrency}>
            <Reset variant="bodyMedium">{transactionsFilter.currencies.reset}</Reset>
          </ResetButton>
        ) : (
          <ArrowRight />
        )}
      </CurrencyButton>
    </Block>
  );
};

const Block = styled.View`
  margin-bottom: 24px;
`;

const HeaderBlock = styled.View`
  padding-bottom: 4px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme: { colors } }) => colors.secondaryLightGrey};
  margin-bottom: 12px;
`;

const CurrencyButton = styled.TouchableOpacity`
  min-height: 36px;
  border-radius: 4px;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.secondaryActive};
  padding: 6px 7px 6px 16px;
`;

const List = styled(AppText)`
  flex: 1;
`;

const ResetButton = styled.TouchableOpacity`
  margin-left: auto;
`;

const Reset = styled(AppText)`
  color: ${({ theme: { colors } }) => colors.primaryBlue};
`;

const ArrowRight = styled(ArrowGrayRight)`
  margin-left: auto;
`;

const Title = styled(AppText)``;

export default CurrencyBlock;
