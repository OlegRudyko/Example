import { Currencies } from '__generated__/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { GetMeCurrencies } from 'common/queries/__generated__/get-me-currencies.query';
import { RootState } from 'store';

type CurrenciesState = {
  currencies: Currencies[];
  currenciesMap: Record<string, Currencies>;
};

const initialState: CurrenciesState = {
  currencies: [],
  currenciesMap: {} as Record<string, Currencies>,
};

const priceRateSlice = createSlice({
  name: 'priceRate',
  initialState,
  reducers: {
    setupCurrencies(state, { payload }: PayloadAction<GetMeCurrencies>) {
      const currencies = [...(payload.currencies || []), ...(payload.fetchDexCurrencies || [])];
      state.currencies = currencies;

      const currenciesMap = {} as Record<string, Currencies>;
      currencies.forEach((currency) => {
        currenciesMap[currency.id] = currency;
      });
      state.currenciesMap = currenciesMap;
    },
  },
});

export const selectors = {
  selectAllCurrenciesList: (state: RootState) => state.currencies.currencies,
  selectCurrenciesMap: (state: RootState) => state.currencies.currenciesMap,
  selectCurrencyById: (id: number) => (state: RootState) => state.currencies.currenciesMap[id],
  selectCurrencyByName: (name: string) => (state: RootState) =>
    state.currencies.currencies.find((c) => c.currency === name),
};

export const { reducer } = priceRateSlice;
export const actions = { ...priceRateSlice.actions };
