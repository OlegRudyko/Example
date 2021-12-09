import { BASE_URL } from "@constants";
import CookieManager from "@react-native-cookies/cookies";
import { signUp as fetchSignUp, login, loginConfirm } from "api";
import { SignUpPayload } from "api/types";
import Apollo from "libs/Apollo";
import { AsyncStorageClient } from "libs/AsyncStorage";
import { useCallback } from "react";
import { actions, useAppDispatch } from "store";

const useAuth = () => {
  const dispatch = useAppDispatch();

  const signIn = useCallback(
    async (email: string, password: string) => {
      const data = await login(email, password);
      if (data?.token) {
        AsyncStorageClient.setAuthToken(data.token);
        dispatch(actions.auth.setToken(data.token));
        CookieManager.set(BASE_URL, {
          name: "session_token",
          value: data.token,
        });
      }
    },
    [dispatch]
  );

  const signInConfirm = useCallback(
    async (code: string) => {
      const data = await loginConfirm(code);
      if (data?.token) {
        AsyncStorageClient.setAuthToken(data.token);
        dispatch(actions.auth.setToken(data.token));
        CookieManager.set(BASE_URL, {
          name: "session_token",
          value: data.token,
        });
      }
    },
    [dispatch]
  );

  const signUp = useCallback(
    async ({
      chkpersonal,
      promo,
      password,
      username,
      sendemail,
      repassword,
    }: SignUpPayload) => {
      const data = await fetchSignUp(
        username,
        password,
        repassword,
        sendemail,
        chkpersonal,
        promo
      );
      if (data?.token) {
        AsyncStorageClient.setAuthToken(data.token);
        dispatch(actions.auth.setToken(data.token));
        CookieManager.set(BASE_URL, {
          name: "session_token",
          value: data.token,
        });
      }
    },
    [dispatch]
  );

  const signOut = useCallback(() => {
    AsyncStorageClient.removeAuthToken();
    AsyncStorageClient.removeEnterCode();
    Apollo.resetCache();
    CookieManager.clearAll();
    dispatch(actions.auth.signOut());
  }, [dispatch]);

  return {
    signIn,
    signInConfirm,
    signOut,
    signUp,
  };
};

export default useAuth;
