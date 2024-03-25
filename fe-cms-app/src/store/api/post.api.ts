import {
  IAffectedResult,
  IGetPostsParams,
  IPaginated,
  IPost,
  IResponse,
  IUpdatePostData,
} from '../../shared/types';
import { POSTS_TAG, POSTS_TAG_ID } from '../../shared/utils/constants';
import { mainApi } from './main.api';

export const postApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createPost: build.mutation<IResponse<IPost>, FormData>({
      query: (body) => ({
        url: '/posts',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: POSTS_TAG, id: POSTS_TAG_ID }],
    }),
    updatePost: build.mutation<IResponse<IPost>, IUpdatePostData>({
      query: ({ body, id }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: POSTS_TAG, id: POSTS_TAG_ID }],
    }),
    deletePost: build.mutation<IResponse<IAffectedResult>, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: POSTS_TAG, id: POSTS_TAG_ID }],
    }),
    getPostById: build.query<IResponse<IPost>, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'GET',
      }),
      providesTags: [{ type: POSTS_TAG, id: POSTS_TAG_ID }],
    }),
    getPosts: build.query<IResponse<IPaginated<IPost>>, IGetPostsParams>({
      query: (params) => ({
        url: '/posts',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const {
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostByIdQuery,
  useGetPostsQuery,
  useLazyGetPostByIdQuery,
} = postApi;
