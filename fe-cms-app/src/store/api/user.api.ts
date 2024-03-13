import {
  IAffectedResult,
  IGetUsersParams,
  IPaginated,
  IResponse,
  IUpdateUser,
  IUser,
} from '../../shared/types';
import { USER_TAG, USER_TAG_ID } from '../../shared/utils/constants';
import { mainApi } from './main.api';

export const userApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getUserById: build.query<IResponse<IUser>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
    }),
    createUser: build.mutation<IResponse<IAffectedResult>, FormData>({
      query: (formData) => ({
        url: `/users`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: USER_TAG, id: USER_TAG_ID }],
    }),
    updateUserById: build.mutation<IResponse<IAffectedResult>, IUpdateUser>({
      query: ({ userData, userId }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: [{ type: USER_TAG, id: USER_TAG_ID }],
    }),
    deleteUserById: build.mutation<IResponse<IAffectedResult>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: USER_TAG, id: USER_TAG_ID }],
    }),
    getMe: build.query<IResponse<IUser>, void>({
      query: () => ({
        url: '/users/me',
        method: 'GET',
      }),
    }),
    getAllUsers: build.query<IResponse<IPaginated<IUser>>, IGetUsersParams>({
      query: (params) => ({
        url: '/users',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...(result.data?.items?.map(
                ({ id }) => ({ type: USER_TAG, id }) as const,
              ) ?? []),
              { type: USER_TAG, id: USER_TAG_ID },
            ]
          : [{ type: USER_TAG, id: USER_TAG_ID }],
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useUpdateUserByIdMutation,
  useDeleteUserByIdMutation,
  useGetAllUsersQuery,
  useGetMeQuery,
  useLazyGetAllUsersQuery,
  useLazyGetMeQuery,
  useCreateUserMutation,
} = userApi;
