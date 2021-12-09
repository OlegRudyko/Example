import React from 'react';
import styled from 'styled-components/native';
import { AppButton, AppText } from 'ui';

type ButtonsBlockProps = {
  title: string;
  arr: any[];
  value: string;
  setValue: (val: any) => void;
};

const ButtonsBlock: React.FC<ButtonsBlockProps> = ({ title, arr, value, setValue }) => {
  return (
    <Root>
      <Header>
        <Title variant="title18Bold">{title}</Title>
      </Header>
      <Main horizontal showsHorizontalScrollIndicator={false}>
        {arr.map((item) => {
          const [key, val] = item;
          const isActive = key === value;

          return (
            <Button
              key={key}
              isSmall
              label={val}
              onPress={() => setValue(key)}
              variant={isActive ? 'primary' : 'secondary'}
            />
          );
        })}
      </Main>
    </Root>
  );
};

const Root = styled.View`
  margin-bottom: 8px;
`;

const Header = styled.View`
  padding-bottom: 4px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme: { colors } }) => colors.secondaryLightGrey};
  margin-bottom: 12px;
`;

const Title = styled(AppText)``;

const Main = styled.ScrollView`
  flex-direction: row;
`;

const Button = styled(AppButton)`
  margin-right: 4px;
`;

export default ButtonsBlock;
