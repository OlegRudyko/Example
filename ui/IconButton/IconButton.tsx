import useAutoHitSlop from 'hooks/useAutoHitSlop';
import React, { FC } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { CSSProp } from 'styled-components';
import styled from 'styled-components/native';

type SvgIconElement = (props: SvgProps) => JSX.Element;

type IconButtonProps = {
  Icon: SvgIconElement;
  iconStyles?: SvgProps;
  containerStyles?: CSSProp;
} & TouchableOpacityProps;

const IconButton: FC<IconButtonProps> = ({ Icon, containerStyles = {}, iconStyles = {}, ...otherProps }) => {
  const [hitSlop, onLayout] = useAutoHitSlop();

  return (
    <TouchableOpacity {...otherProps} hitSlop={hitSlop} onLayout={onLayout} activeOpacity={1}>
      <IconContainer $CSS={containerStyles}>
        <Icon {...iconStyles} />
      </IconContainer>
    </TouchableOpacity>
  );
};

export default IconButton;

const IconContainer = styled.View<{ $CSS: CSSProp }>`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
