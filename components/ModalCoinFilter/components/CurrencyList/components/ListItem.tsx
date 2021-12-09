import { DropdownChoiseIcon } from 'assets/svgs';
import { CurrencyIcon } from 'components';
import React from 'react';
import styled from 'styled-components/native';
import { AppText } from 'ui';

type ListItemProps = {
  alias: string;
  currency: string;
  isSelected: boolean;
  id: number;
  selected: (val: { alias: string; id: number }) => void;
};

const ListItem: React.FC<ListItemProps> = ({ alias, currency, id, isSelected, selected }) => {
  return (
    <Root onPress={() => selected({ alias, id })}>
      <Wrapper>
        <CurrencyIcon currency={currency} width={30} height={30} />
        <Title variant="bodyMedium">{alias}</Title>
      </Wrapper>
      {isSelected && <DropdownChoiseIcon />}
    </Root>
  );
};

const Root = styled.TouchableOpacity`
  padding: 8px 0px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme: { colors } }) => colors.secondaryLightGrey};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Title = styled(AppText)`
  margin-left: 16px;
`;

export default ListItem;
