import { HEADER_HEIGHT } from '@constants';
import React, { FC } from 'react';
import { View } from 'react-native';
import { CSSProp } from 'styled-components';
import styled from 'styled-components/native';
import { AppText } from 'ui';

interface MainHeaderProps {
  title: string;
  renderRightElement?: () => React.ReactNode;
  containerStyle?: CSSProp;
}

const MainHeder: FC<MainHeaderProps> = ({ title, renderRightElement, containerStyle = {} }) => {
  return (
    <Root $CSS={containerStyle}>
      <TitleContainer>
        <AppText variant="title32">{title}</AppText>
      </TitleContainer>

      <View>{renderRightElement && renderRightElement()}</View>
    </Root>
  );
};

export default MainHeder;

const Root = styled.View<{ $CSS: CSSProp }>`
  flex-direction: row;
  height: ${HEADER_HEIGHT}px;
  align-items: center;

  ${({ $CSS }) => $CSS}
`;

const TitleContainer = styled.View`
  flex: 1;

  margin-right: 20px;
`;
