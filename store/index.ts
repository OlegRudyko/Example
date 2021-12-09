import { ENVIRONMENT } from '@constants';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { actions, reducer, selectors } from './ducks';

export { actions, selectors };

type State = ReturnType<typeof reducer>;

export const rootReducer = (state: State, action: any) => {
  let nextState = state as State | undefined;

  return reducer(nextState, action);
};

const middlewares = [];

if (ENVIRONMENT === 'development') {
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

export const store = configureStore({
  // @ts-ignore
  reducer: rootReducer,
  devTools: true,
  middleware: middlewares,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
