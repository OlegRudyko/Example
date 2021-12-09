import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { VariantCurrency } from 'types';

type baseCurrencyState = {
  baseCurrency: VariantCurrency;
};

const initialState: baseCurrencyState = {
  baseCurrency: 'USD',
};

const baseCurrencySlice = createSlice({
  name: 'baseCurrency',
  initialState,
  reducers: {
    changeBaseCurrency(state, { payload }: PayloadAction<VariantCurrency>) {
      state.baseCurrency = payload;
    },
  },
});

export const selectors = {
  selectBaseCurrency: (state: RootState) => state.baseCurrency.baseCurrency,
};

export const { reducer } = baseCurrencySlice;
export const actions = { ...baseCurrencySlice.actions };
