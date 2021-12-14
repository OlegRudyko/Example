import { Currencies } from '__generated__/types';
import { useNavigation } from '@react-navigation/core';
import { ArrowAltDownIcon, ArrowAltTopIcon, ArrowDownIcon, ArrowReturnIcon, ExchangeIcon } from 'assets/svgs';
import { useTypedTranslation } from 'hooks';
import { TranslationObject } from 'libs/i18n';
import AppRoutes from 'navigations/routes';
import React from 'react';
import styled, { useTheme } from 'styled-components/native';
import { AppButton, AppText } from 'ui';

type OperationsProps = {
  data: Currencies | undefined;
};

const Operations: React.FC<OperationsProps> = ({ data = {} }) => {
  const coin = useTypedTranslation<TranslationObject['screens']['coin']>('screens.coin');
  const theme = useTheme();
  const { allowDeposit, allowWithdraw, allowExchange, allowFiatDeposit, allowFiatWithdrawal } = data;

  const { navigate } = useNavigation();

  const goToExchange = () => {
    navigate(AppRoutes.CurrencyStack, {
      screen: AppRoutes.CurrencyExchangeScreen,
      params: {
        currency: data,
        isScreen: true,
      },
    });
  };

  return (
    <Root>
      <BlueButtonsWrapper>
        <BlueButton activeOpacity={0.8} disabled={!allowDeposit}>
          <ArrowDownIcon fill={!allowDeposit ? theme.colors.primaryBlueGray : theme.colors.primaryWhite} />
          <Text isDisabled={!allowDeposit} variant="caption12Bold">
            {coin.operations.acceptToAddress}
          </Text>
        </BlueButton>
        <BlueButton onPress={goToExchange} activeOpacity={0.8} disabled={!allowExchange}>
          <ExchangeIcon fill={!allowExchange ? theme.colors.primaryBlueGray : theme.colors.primaryWhite} />
          <Text isDisabled={!allowExchange} variant="caption12Bold">
            {coin.operations.change}
          </Text>
        </BlueButton>
        <BlueButton activeOpacity={0.8} disabled={!allowWithdraw}>
          <ArrowReturnIcon fill={!allowWithdraw ? theme.colors.primaryBlueGray : theme.colors.primaryWhite} />
          <Text isDisabled={!allowWithdraw} variant="caption12Bold">
            {coin.operations.sendToAddress}
          </Text>
        </BlueButton>
      </BlueButtonsWrapper>
      <ButtonsWrapper>
        <LeftButton
          icon={<ArrowAltDownIcon />}
          isSquareBorder
          isDisabled={!allowFiatDeposit}
          label={coin.operations.buy}
        />
        <RightButton
          icon={<ArrowAltTopIcon />}
          isSquareBorder
          isDisabled={!allowFiatWithdrawal}
          label={coin.operations.sell}
        />
      </ButtonsWrapper>
    </Root>
  );
};

type ItemProps = {
  isDisabled: boolean;
};

const Root = styled.View`
  margin-top: 18px;
`;

const BlueButtonsWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const BlueButton = styled.TouchableOpacity`
  width: 106px;
  height: 92px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background-color: ${({ theme: { colors } }) => colors.primaryBlue};
`;

const Text = styled(AppText)<ItemProps>`
  color: ${({ theme: { colors }, isDisabled }) => (isDisabled ? colors.primaryBlueGray : colors.primaryWhite)};
  margin-top: 8px;
  text-align: center;
`;

const ButtonsWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LeftButton = styled(AppButton)`
  margin-right: 8px;
  flex: 1;
`;

const RightButton = styled(AppButton)`
  flex: 1;
`;

export default Operations;
