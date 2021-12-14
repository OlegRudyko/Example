import { HEADER_HEIGHT } from '@constants';
import { useNavigation } from '@react-navigation/core';
import { BackIcon } from 'assets/svgs';
import React, { FC } from 'react';
import { CSSProp } from 'styled-components';
import styled from 'styled-components/native';
import { AppText, IconButton } from 'ui';

interface NestedHeaderProps {
  title?: string;
  renderRightElement?: () => React.ReactNode;
  withBack?: boolean;
  containerStyle?: CSSProp;
  goBack?: () => void;
}

const NestedHeader: FC<NestedHeaderProps> = ({
  title,
  renderRightElement,
  containerStyle = {},
  withBack = true,
  goBack,
}) => {
  const { goBack: goBackBase } = useNavigation();

  return (
    <Root $CSS={containerStyle}>
      {withBack && (
        <LeftContainer>
          <IconButton Icon={BackIcon} onPress={goBack ? goBack : goBackBase} />
        </LeftContainer>
      )}

      {title && (
        <TitleContainer>
          <AppText variant="title18Bold">{title}</AppText>
        </TitleContainer>
      )}

      <RightContainer>{renderRightElement && renderRightElement()}</RightContainer>
    </Root>
  );
};

export default NestedHeader;

const Root = styled.View<{ $CSS: CSSProp }>`
  position: relative;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: ${HEADER_HEIGHT}px;
  ${({ $CSS }) => $CSS}
`;

const TitleContainer = styled.View`
  flex: 1;
  align-items: center;
  margin: 0 30px;
`;

const LeftContainer = styled.View``;

const RightContainer = styled.View``;
