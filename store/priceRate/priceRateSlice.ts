import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { PriceRate } from 'types';

type PriceRateState = Record<string, PriceRate> & {
  activeSubscribes: string[];
};

// @ts-ignore
const initialState: PriceRateState = {
  activeSubscribes: [] as string[],
};

const priceRateSlice = createSlice({
  name: 'priceRate',
  initialState,
  reducers: {
    updatePriceRateItem(state, { payload }: PayloadAction<PriceRate>) {
      const key = `${payload.currencyFrom}/${payload.currencyTo}`;
      state[key] = payload;
    },
    addActiveSubscribes(state, { payload }: PayloadAction<string>) {
      state.activeSubscribes.push(payload);
    },
    removeAllSubscribes(state) {
      state.activeSubscribes = [];
    },
    addManySubscribes(state, { payload }: PayloadAction<Record<string, PriceRate>>) {
      return { ...state, ...payload };
    },
  },
});

export const selectors = {
  selectAllPriceRate: (state: RootState) => state.priceRate,
  selectActiveSubscribes: (state: RootState) => state.priceRate.activeSubscribes,
  selectPriceRateByFromTo: (currencyFrom: string, currencyTo: string) => (state: RootState) =>
    state.priceRate[`${currencyFrom}/${currencyTo}`],
};

export const { reducer } = priceRateSlice;
export const actions = { ...priceRateSlice.actions };
