import { HttpService } from "services";

import { BaseSuccessAuthType, ErrorResponse, LoginSuccess } from "./types";

export const sendForgotPassword = (
  email: string
): Promise<BaseSuccessAuthType & Partial<ErrorResponse>> => {
  return HttpService.post("", {
    action: "forgot",
    email: email,
  })
    .then((res) => res.data)
    .then((res) => {
      if (res.success) {
        return res;
      }
      const error = new Error("Email error");
      return Promise.reject({ ...error, message: res.text });
    })
    .catch((err) => {
      return Promise.reject({ ...err });
    });
};

export const confirmForgotPassword = (
  code: string
): Promise<BaseSuccessAuthType & Partial<ErrorResponse>> => {
  return HttpService.post("", {
    action: "forgot_confirm",
    code: code,
  })
    .then((res) => res.data)
    .then((res) => {
      if (res.success) {
        return res;
      }
      const error = new Error("Code error");
      return Promise.reject({ ...error, message: res.text });
    })
    .catch((err) => {
      return Promise.reject({ ...err });
    });
};

export const signUp = (
  username: string,
  password: string,
  repassword: string,
  sendemail: boolean = false,
  chkpersonal: boolean = true,
  promo?: string
): Promise<
  BaseSuccessAuthType & Partial<LoginSuccess> & Partial<ErrorResponse>
> => {
  let data = {
    action: "registration",
    username,
    password,
    repassword,
    sendemail,
    chkpersonal,
    ...(Boolean(promo) && { promo }),
  };
  return HttpService.post("", data)
    .then((res) => res.data)
    .then((res) => {
      if (res.success && res.token) {
        return res;
      }
      const error = new Error("Fail registration");
      return Promise.reject({ ...error, message: res.text });
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export const login = (
  email: string,
  password: string
): Promise<
  BaseSuccessAuthType & Partial<LoginSuccess> & Partial<ErrorResponse>
> => {
  return HttpService.post("", {
    email,
    action: "login",
    password,
  })
    .then((res) => res.data)
    .then((res) => {
      if (res.success) {
        return res;
      }
      const error = new Error("Fail authorize");
      return Promise.reject({ ...error, message: res.text });
    })
    .then((res) => {
      if (!res.token) {
        const error = new Error("Fail authorize");
        return Promise.reject({
          ...error,
          message: res.text,
          ...(res.ip && { ip: res.ip }),
        });
      }
      return res;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export const loginConfirm = (
  code: string
): Promise<
  BaseSuccessAuthType & Partial<LoginSuccess> & Partial<ErrorResponse>
> => {
  return HttpService.post("", {
    action: "login_confirm",
    code,
  })
    .then((res) => res.data)
    .then((res) => {
      if (res.success && res.token) {
        return res;
      }
      const error = new Error("Fail confirm code");
      return Promise.reject({ ...error, message: res.text });
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
