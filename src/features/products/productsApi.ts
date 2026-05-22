import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { PageResponse, ProductoResumen, ProductoDetalle } from '../../shared/types/models';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getProducts: builder.query<PageResponse<ProductoResumen>, { nombre?: string; categoriaId?: number; precioMin?: number; precioMax?: number; page?: number; size?: number }>({
      query: (params) => ({ url: '/productos', params }),
    }),
    getProduct: builder.query<ProductoDetalle, number>({
      query: (id) => `/productos/${id}`,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery } = productsApi;
