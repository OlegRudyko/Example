import { combineReducers } from 'redux';

import * as auth from './auth';
import * as baseCurrency from './baseCurrency';
import * as currencies from './currencies';
import * as priceRate from './priceRate';

export const reducer = combineReducers({
  auth: auth.reducer,
  priceRate: priceRate.reducer,
  baseCurrency: baseCurrency.reducer,
  currencies: currencies.reducer,
});

export const actions = {
  auth: auth.actions,
  priceRate: priceRate.actions,
  baseCurrency: baseCurrency.actions,
  currencies: currencies.actions,
};

export const selectors = {
  auth: auth.selectors,
  priceRate: priceRate.selectors,
  baseCurrency: baseCurrency.selectors,
  currencies: currencies.selectors,
};
