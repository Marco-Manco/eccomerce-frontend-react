import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Carrito } from '../../shared/types/models';
import type { RootState } from '../../app/store';
import { API_BASE } from '../../shared/utils/constants';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE + '/api/carrito',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query<Carrito, void>({
      query: () => '',
      providesTags: ['Cart'],
    }),
    addItem: builder.mutation<Carrito, { varianteProductoId: number; cantidad: number }>({
      query: (body) => ({ url: '/items', method: 'POST', body }),
      invalidatesTags: ['Cart'],
    }),
    updateItem: builder.mutation<Carrito, { id: number; cantidad: number }>({
      query: ({ id, cantidad }) => ({ url: `/items/${id}`, method: 'PATCH', params: { cantidad } }),
      invalidatesTags: ['Cart'],
    }),
    removeItem: builder.mutation<Carrito, number>({
      query: (id) => ({ url: `/items/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const { useGetCartQuery, useAddItemMutation, useUpdateItemMutation, useRemoveItemMutation, useClearCartMutation } = cartApi;
