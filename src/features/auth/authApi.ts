import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AuthResponse } from '../../shared/types/models';
import { API_BASE } from '../../shared/utils/constants';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE + '/api/auth' }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({ url: '/login', method: 'POST', body }),
    }),
    register: builder.mutation<AuthResponse, { nombre: string; email: string; password: string }>({
      query: (body) => ({ url: '/register', method: 'POST', body }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
