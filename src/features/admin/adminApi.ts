import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ProductoDetalle, Variante, Pedido, PageResponse } from '../../shared/types/models';
import type { RootState } from '../../app/store';
import { API_BASE } from '../../shared/utils/constants';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE + '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Product', 'Orders'],
  endpoints: (builder) => ({
    getProductDetail: builder.query<ProductoDetalle, number>({
      query: (id) => `/productos/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation<ProductoDetalle, { nombre: string; descripcion?: string; categoriaId: number }>({
      query: (body) => ({ url: '/admin/productos', method: 'POST', body }),
    }),
    updateProduct: builder.mutation<ProductoDetalle, { id: number; nombre?: string; descripcion?: string; categoriaId?: number; activo?: boolean }>({
      query: ({ id, ...body }) => ({ url: `/admin/productos/${id}`, method: 'PUT', body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Product', id }],
    }),
    updateVariant: builder.mutation<Variante, { id: number; precio?: number; stock?: number; color?: string; talle?: string; activo?: boolean }>({
      query: ({ id, ...body }) => ({ url: `/admin/variantes/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Product'],
    }),
    addVariant: builder.mutation<Variante, { productoId: number; sku: string; color?: string; talle?: string; precio: number; stock: number }>({
      query: ({ productoId, ...body }) => ({ url: `/admin/productos/${productoId}/variantes`, method: 'POST', body }),
      invalidatesTags: ['Product'],
    }),
    uploadImage: builder.mutation<any, { productoId: number; file: File }>({
      query: ({ productoId, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        return { url: `/admin/productos/${productoId}/imagenes`, method: 'POST', body: formData };
      },
      invalidatesTags: ['Product'],
    }),
    deleteImage: builder.mutation<void, number>({
      query: (id) => ({ url: `/admin/imagenes/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
    getAdminOrders: builder.query<PageResponse<Pedido>, { search?: string; estado?: string; desde?: string; hasta?: string; page?: number; size?: number }>({
      query: (params) => ({ url: '/admin/pedidos', params }),
      providesTags: ['Orders'],
    }),
    updateOrderStatus: builder.mutation<Pedido, { id: number; estado: string }>({
      query: ({ id, ...body }) => ({ url: `/admin/pedidos/${id}/estado`, method: 'PATCH', body }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const {
  useGetProductDetailQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateVariantMutation,
  useAddVariantMutation,
  useUploadImageMutation,
  useDeleteImageMutation,
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} = adminApi;
