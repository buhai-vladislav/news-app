import {
  IAffectedResult,
  ICreateTags,
  IDeleteTags,
  IResponse,
  ITag,
} from '../../shared/types';
import { TAGS_TAG, TAGS_TAG_ID } from '../../shared/utils/constants';
import { mainApi } from './main.api';

export const tagsApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getTags: build.query<IResponse<Array<ITag>>, void>({
      query: () => ({
        url: '/tags',
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...(result.data?.map(
                ({ id }) => ({ type: TAGS_TAG, id }) as const,
              ) ?? []),
              { type: TAGS_TAG, id: TAGS_TAG_ID },
            ]
          : [{ type: TAGS_TAG, id: TAGS_TAG_ID }],
    }),
    createTag: build.mutation<IResponse<Array<ITag>>, ICreateTags>({
      query: (body) => ({
        url: '/tags',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: TAGS_TAG, id: TAGS_TAG_ID }],
    }),
    deleteTags: build.mutation<IResponse<IAffectedResult>, IDeleteTags>({
      query: (params) => ({
        url: `/tags`,
        method: 'DELETE',
        params,
      }),
      invalidatesTags: [{ type: TAGS_TAG, id: TAGS_TAG_ID }],
    }),
  }),
});

export const { useCreateTagMutation, useDeleteTagsMutation, useGetTagsQuery } =
  tagsApi;
