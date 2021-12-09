import React from 'react';
import { TouchableHighlightProps } from 'react-native';
import { CSSProp } from 'styled-components';
import styled, { useTheme } from 'styled-components/native';
import { ThemeType } from 'themes';
import { VariantAppText } from 'ui/AppText/AppText';

import AppText from '../AppText';
import Loader from '../Loader';

export type ButtonProps = TouchableHighlightProps & {
  variant?: ButtonVariant;
  label: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isSquareBorder?: boolean;
  icon?: React.ReactNode;
  isSmall?: boolean;
  variantText?: VariantAppText;
  textStyles?: CSSProp;
};

const AppButton: React.FC<ButtonProps> = ({
  label,
  isDisabled = false,
  isLoading = false,
  variant = 'primary',
  isSquareBorder,
  icon,
  isSmall,
  variantText,
  textStyles = {},
  ...props
}) => {
  const theme = useTheme();

  const themeCSS = themes[variant](theme, isDisabled);

  return (
    <Root
      underlayColor={variant === 'primary' ? theme.colors.primaryGrayDark : theme.colors.secondaryGrey}
      disabled={isDisabled || isLoading}
      $isDisabled={isDisabled}
      $isLoading={isLoading}
      $variant={variant}
      $themeCSS={themeCSS}
      $isSmall={isSmall}
      $isSquareBorder={isSquareBorder}
      onPress={props.onPress}
      {...props}
    >
      {isLoading ? (
        <Loader color={variant === 'primary' ? theme.colors.primaryWhite : theme.colors.primaryBlack} />
      ) : (
        <>
          {icon && <IconWrapper>{icon}</IconWrapper>}
          <ButtonLabel
            $TextCSS={textStyles}
            variant={variantText ? variantText : isSmall ? 'bodyMedium' : 'title16Bold'}
            $isDisabled={isDisabled}
            $variant={variant}
          >
            {label}
          </ButtonLabel>
        </>
      )}
    </Root>
  );
};

export type ButtonVariant = 'primary' | 'secondary';

type RootProps = {
  $isLoading?: boolean;
  $isDisabled?: boolean;
  $themeCSS?: string;
  $variant?: ButtonVariant;
  $isSquareBorder?: boolean;
  $isSmall?: boolean;
  $TextCSS?: CSSProp;
};

const themes = {
  primary: (theme: ThemeType, isDisabled: boolean) => `
      background-color: ${theme.colors.primaryBlack};
      ${isDisabled && `background-color: ${theme.colors.primaryGray}`};
    `,
  secondary: (theme: ThemeType, isDisabled: boolean) => `
      background-color: ${theme.colors.secondaryActive};
      ${isDisabled && `background-color: ${theme.colors.secondaryDarkGrey}`};
    `,
};

const Root = styled.TouchableHighlight<RootProps>`
  min-height: ${({ $isSmall }) => ($isSmall ? '28px' : '44px')};
  border-radius: ${({ $isSquareBorder }) => ($isSquareBorder ? '8px' : '24px')};
  border: none;
  padding: ${({ $isSmall }) => ($isSmall ? '5px 8px' : '10px 24px')};
  flex-direction: row;
  ${({ $themeCSS }) => $themeCSS};
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const ButtonLabel = styled(AppText)<RootProps>`
  ${({ $variant, $isDisabled, theme: { colors } }) =>
    `color: ${$variant === 'primary' || $isDisabled ? colors.primaryWhiteText : colors.primaryBlackText}`};

  ${({ $TextCSS }) => $TextCSS}
`;

const IconWrapper = styled.View`
  margin-right: 10px;
`;

export default AppButton;
