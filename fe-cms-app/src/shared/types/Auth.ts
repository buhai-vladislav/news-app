interface ILogin {
  email: string;
  password: string;
}

interface ILogout {
  refreshToken: string;
}

export type { ILogin, ILogout };
