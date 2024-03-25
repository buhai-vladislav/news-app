import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { IResponse, ITokenPair } from '../../shared/types';
import { resetUser } from '../slices/user.slice';
import { POSTS_TAG, TAGS_TAG, USER_TAG } from '../../shared/utils/constants';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (typeof args !== 'string') {
    if (
      result.error &&
      result.error.status === 401 &&
      args.url !== '/auth/login'
    ) {
      const refreshToken = localStorage.getItem('refreshToken');

      const refreshResult = await baseQuery(
        { url: `/auth/refresh?token=${refreshToken}`, method: 'POST' },
        api,
        extraOptions,
      );
      if (refreshResult.data) {
        const refeshTokenResult = refreshResult.data as IResponse<ITokenPair>;

        if (refeshTokenResult?.data) {
          localStorage.setItem(
            'accessToken',
            refeshTokenResult?.data?.accessToken,
          );
          localStorage.setItem(
            'refreshToken',
            refeshTokenResult.data.refreshToken,
          );

          result = await baseQuery(args, api, extraOptions);
        }
      } else {
        localStorage.clear();
        // TODO: add logout reducer
        api.dispatch(resetUser());
        window.location.href = '/login';
      }
    }
  }

  return result;
};

export const mainApi = createApi({
  reducerPath: 'main',
  baseQuery: baseQueryWithReauth,
  tagTypes: [USER_TAG, TAGS_TAG, POSTS_TAG],
  endpoints: (_build) => ({}),
});
