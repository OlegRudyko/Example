import { Currencies } from '__generated__/types';
import { StartIcon } from 'assets/svgs';
import { useGetCoinInfo } from 'common/queries/__generated__/get-coin-info.query';
import { useGetFavoriteCurrencies } from 'common/queries/__generated__/get-favorite-currencies.query';
import { useGetMeCurrencies } from 'common/queries/__generated__/get-me-currencies.query';
import { useGetTransactions } from 'common/queries/__generated__/get-transactions.query';
import { useToggleFavoriteCurrency } from 'common/queries/__generated__/toggle-favorite-currency.query';
import { DefaultLayout, NestedHeader } from 'layouts';
import { CurrencyNavigatorParams } from 'navigations/AuthorizeNavigator/MainTabStack/CurrencyStack/CurrencyStack';
import { HomeNavigatorParams } from 'navigations/AuthorizeNavigator/MainTabStack/HomeStack/HomeStack';
import AppRoutes from 'navigations/routes';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Language, ScreenBaseProps } from 'types';
import { IconButton, Loader } from 'ui';

import { BalanceCoin, CurrencyTabs, Operations } from './components';

type CoinScreenNavigationProps = ScreenBaseProps<
  AppRoutes.CurrencyCoinScreen | AppRoutes.HomeCoinScreen,
  HomeNavigatorParams & CurrencyNavigatorParams
>;
type CoinScreenProps = CoinScreenNavigationProps & {};

const CoinScreen: React.FC<CoinScreenProps> = ({ route, navigation }) => {
  const { i18n } = useTranslation();
  const { colors } = useTheme();
  const locale = i18n.language as Language;
  const [isFavorite, setIsFavorite] = useState(false);
  const { data, loading } = useGetMeCurrencies({
    fetchPolicy: 'cache-only',
  });
  const fullData = [...(data?.currencies || []), ...(data?.fetchDexCurrencies || [])];
  const filteredCoin = fullData.find((item) => item.currency === route.params.currency) as Currencies;
  const { data: favoriteCurrenciesResp, loading: loadingFavorite } = useGetFavoriteCurrencies({
    fetchPolicy: 'cache-and-network',
  });

  const { data: coinInfo, loading: loadInfo } = useGetCoinInfo({
    variables: { coin: route.params.currency, lang: locale },
  });

  const [toggleFavorite, { loading: loadToggle }] = useToggleFavoriteCurrency({
    variables: { currencyName: route.params.currency, favorite: !isFavorite },
    onCompleted: () => setIsFavorite(!isFavorite),
  });

  const {
    data: operations,
    loading: loadingTransactions,
    refetch,
  } = useGetTransactions({
    fetchPolicy: 'network-only',
    variables: {
      baseCurrency: '',
      offset: '2010-10-16T09:24:31.864Z',
    },
  });

  useEffect(() => {
    if (favoriteCurrenciesResp?.favoriteCurrencies) {
      const item = favoriteCurrenciesResp?.favoriteCurrencies.find((item) => item.currency === route.params.currency);
      !!item?.favorite && setIsFavorite(item?.favorite);
    }
  }, [favoriteCurrenciesResp?.favoriteCurrencies]);

  const goBack = () => {
    navigation.goBack();
  };

  const renderFavoritIcon = () => {
    return (
      <IconButton
        Icon={() =>
          loadToggle || loadingFavorite ? (
            <Loader color={colors.primaryBlack} />
          ) : (
            <StartIcon fill={isFavorite ? colors.primaryBlack : colors.transparent} />
          )
        }
        onPress={() => {
          toggleFavorite();
        }}
      />
    );
  };

  return (
    <DefaultLayout>
      <NestedHeader withBack goBack={goBack} renderRightElement={renderFavoritIcon} />
      {loading || loadingTransactions || loadInfo ? (
        <LoaderWrapper color={colors.primaryBlack} />
      ) : (
        <DefaultLayout.ScrollView
          refreshControl={<RefreshControl refreshing={loadingTransactions} onRefresh={refetch} />}
        >
          <BalanceCoin currency={filteredCoin} />
          <Operations data={filteredCoin} />
          <CurrencyTabs
            operations={operations?.getTransactions}
            coinInfo={coinInfo?.getCoinInfo}
            currency={filteredCoin}
          />
        </DefaultLayout.ScrollView>
      )}
    </DefaultLayout>
  );
};

const LoaderWrapper = styled(Loader)`
  margin: auto;
`;

export default CoinScreen;
