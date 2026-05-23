import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Pedido, PageResponse } from '../../shared/types/models';
import type { RootState } from '../../app/store';
import { API_BASE } from '../../shared/utils/constants';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE + '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getOrders: builder.query<PageResponse<Pedido>, { page?: number; size?: number }>({
      query: (params) => ({ url: '/pedidos', params }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetOrdersQuery } = ordersApi;
