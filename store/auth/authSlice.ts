import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AsyncStorageClient } from 'libs/AsyncStorage';
import { RootState } from 'store';
import { ThemesNames } from 'themes';

type AuthState = {
  token: string | null;
  code: string | null;
  theme: ThemesNames;
};

const initialState: AuthState = {
  token: null,
  code: null,
  theme: 'default',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, { payload }: PayloadAction<string>) {
      state.token = payload;
    },
    setCode(state, { payload }: PayloadAction<string>) {
      AsyncStorageClient.setEnterCode(payload);
      state.code = payload;
    },
    resetCode(state) {
      AsyncStorageClient.removeEnterCode();
      state.code = null;
    },
    setTheme(state, { payload }: PayloadAction<ThemesNames>) {
      AsyncStorageClient.setTheme(payload);
      state.theme = payload;
    },
    setAll(state, { payload }: PayloadAction<AuthState>) {
      state.token = payload.token;
      state.code = payload.code;
      state.theme = payload.theme;
    },
    signOut(state) {
      state.code = null;
      state.token = null;
    },
  },
});

export const selectors = {
  selectAuthToken: (state: RootState) => state.auth.token,
  selectEnterCode: (state: RootState) => state.auth.code,
  selectTheme: (state: RootState) => state.auth.theme,
};

export const { reducer } = authSlice;
export const actions = { ...authSlice.actions };
