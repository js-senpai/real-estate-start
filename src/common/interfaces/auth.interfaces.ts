export interface IAuthPayload {
  email: string;
  sub: string;
}

export interface IAuth {
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshTokenAuth {
  id: string;
  refreshToken: string;
}
