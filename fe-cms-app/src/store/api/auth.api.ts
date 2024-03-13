import {
  IAffectedResult,
  ILogin,
  ILogout,
  IResponse,
  ITokenPair,
} from '../../shared/types';
import { mainApi } from './main.api';

const authApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<IResponse<ITokenPair>, ILogin>({
      query: (loginDto) => ({
        url: `/auth/login`,
        method: 'POST',
        body: loginDto,
      }),
    }),
    signup: build.mutation<IResponse<IAffectedResult>, FormData>({
      query: (createUserDto) => ({
        url: `/auth/signup`,
        method: 'POST',
        body: createUserDto,
      }),
    }),
    logout: build.mutation<IResponse<IAffectedResult>, ILogout>({
      query: (logoutDto) => ({
        url: `/auth/logout`,
        method: 'POST',
        body: logoutDto,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useLogoutMutation } =
  authApi;
