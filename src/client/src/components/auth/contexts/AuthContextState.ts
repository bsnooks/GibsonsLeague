
export interface IAuthContextState {
  token?: string;
  username?: string;
};

export type UpdateTokenState = {
  token: string;
};

export type UpdateUsernameState = {
  username: string;
};