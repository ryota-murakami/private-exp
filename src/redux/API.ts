import type { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks'
import type {
  MutationDefinition,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const endpoint = process.env.VITE_API_ENDPOINT

interface UserIdPassword {
  name: Author['name']
  password: Author['password']
}

// Define a service using a base URL and expected endpoints
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const requestInfo = Object.defineProperty({}, 'credentials', {
  value: 'include',
  writable: false,
})

export const API = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: endpoint,
    fetchFn: (requestInfo: RequestInfo, ...rest) => fetch(requestInfo, ...rest),
    prepareHeaders: (headers: Headers) => {
      return headers
    },
  }),
  endpoints: (builder) => ({
    createPost: builder.mutation<Post, CreatePostRequest>({
      invalidatesTags: () => [{ type: 'Posts' }],
      query: (values) => ({
        body: values,
        method: 'POST',
        url: 'create',
      }),
    }),

    deletePost: builder.mutation<
      DeletePostResponse,
      { id: Post['id']; author: Author }
    >({
      invalidatesTags: (result, error, { id }) => [{ id, type: 'Posts' }],
      query: ({ id, author }) => ({
        body: { author: author },
        method: 'DELETE',
        url: `post/${id}/`,
      }),
    }),

    fetchPost: builder.query<Post, Post['id']>({
      providesTags: (result, error, id) => [{ id, type: 'Posts' }],
      query: (id) => ({ method: 'GET', url: `post/${id}` }),
    }),

    fetchPostList: builder.query<PostListResponce, PostListRequestParamClient>({
      providesTags: (result) =>
        result && result.postList
          ? [
              ...result.postList.map(({ id }) => ({
                id,
                type: 'Posts' as const,
              })),
              { id: 'LIST', type: 'Posts' },
            ]
          : [{ id: 'LIST', type: 'Posts' }],
      query: ({ page, perPage }) => `post_list?page=${page}&perPage=${perPage}`,
    }),

    getUserCount: builder.query<GetUserCountResponse, void>({
      query: () => ({
        method: 'GET',
        url: 'user_count',
      }),
    }),

    loginReqest: builder.mutation<LoginResponse, UserIdPassword>({
      query: (loginInfo) => ({
        body: loginInfo,
        method: 'POST',
        url: 'login',
      }),
    }),

    logoutRequest: builder.mutation<LogoutResponse, void>({
      query: () => ({
        method: 'GET',
        url: 'logout',
      }),
    }),

    signupReqest: builder.mutation<Author, UserIdPassword>({
      query: (loginInfo) => ({
        body: loginInfo,
        method: 'POST',
        url: 'signup',
      }),
    }),
    updatePost: builder.mutation<UpdatePostResponse, UpdatePostRequest>({
      invalidatesTags: (result, error, { id }) => [{ id, type: 'Posts' }],
      query: (values) => ({
        body: values,
        method: 'POST',
        url: 'update',
      }),
    }),
  }),
  keepUnusedDataFor: 180,
  reducerPath: 'RTK_Query',
  tagTypes: ['Posts'],
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUserCountQuery, useSignupReqestMutation } = API

export type CreatePostMutationDefinition = MutationDefinition<
  CreatePostRequest,
  BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    {},
    FetchBaseQueryMeta
  >,
  'Posts',
  Post,
  'RTK_Query'
>

export type UpdatePostMutationDefinition = MutationTrigger<
  MutationDefinition<
    UpdatePostRequest,
    BaseQueryFn<
      string | FetchArgs,
      unknown,
      FetchBaseQueryError,
      {},
      FetchBaseQueryMeta
    >,
    'Posts',
    UpdatePostResponse,
    'RTK_Query'
  >
>
