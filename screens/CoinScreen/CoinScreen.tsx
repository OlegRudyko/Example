import { StartIcon } from 'assets/svgs';
import { useGetCoinInfo } from 'common/queries/__generated__/get-coin-info.query';
import { useGetFavoriteCurrencies } from 'common/queries/__generated__/get-favorite-currencies.query';
import { useGetTransactions } from 'common/queries/__generated__/get-transactions.query';
import { useToggleFavoriteCurrency } from 'common/queries/__generated__/toggle-favorite-currency.query';
import { DefaultLayout, NestedHeader } from 'layouts';
import { CurrencyNavigatorParams } from 'navigations/AuthorizeNavigator/MainTabStack/CurrencyStack/CurrencyStack';
import { HomeNavigatorParams } from 'navigations/AuthorizeNavigator/MainTabStack/HomeStack/HomeStack';
import AppRoutes from 'navigations/routes';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Language, ScreenBaseProps } from 'types';
import { IconButton, Loader } from 'ui';

import { BalanceCoin, CurrencyTabs, Operations } from './components';
import { useSelector } from 'react-redux';
import { selectors } from 'store';

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
  const currency = useSelector(selectors.currencies.selectCurrencyByName(route.params.currency));
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
      const item = favoriteCurrenciesResp?.favoriteCurrencies.find((c) => c.currency === route.params.currency);
      !!item?.favorite && setIsFavorite(item?.favorite);
    }
  }, [favoriteCurrenciesResp?.favoriteCurrencies, route.params.currency]);

  const goBack = () => {
    navigation.goBack();
  };

  const renderFavoriteIcon = () => {
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
      <NestedHeader
        withBack
        goBack={goBack}
        renderRightElement={route.params.withFavoriteIcon ? renderFavoriteIcon : undefined}
      />
      <DefaultLayout.ScrollView
        refreshControl={<RefreshControl refreshing={loadingTransactions} onRefresh={refetch} />}
      >
        <BalanceCoin currency={currency} />
        <Operations data={currency} />
        <CurrencyTabs
          operations={operations?.getTransactions}
          coinInfo={coinInfo?.getCoinInfo}
          currency={currency}
          isLoadInfo={loadInfo}
          isLoadingTransactions={loadingTransactions}
        />
      </DefaultLayout.ScrollView>
    </DefaultLayout>
  );
};

export default CoinScreen;
