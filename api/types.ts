export type BaseSuccessAuthType = {
  success: boolean;
};
export type ErrorResponse = {
  id: string;
  text: string;
};

export type LoginSuccess = {
  token: string;
  url: string;
  ip: string;
  ua: string;
};

export interface SignUpPayload {
  username: string;
  password: string;
  repassword: string;
  sendemail: boolean;
  chkpersonal: boolean;
  promo?: string;
}
