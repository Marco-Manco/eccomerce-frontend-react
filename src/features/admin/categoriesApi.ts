import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Categoria } from '../../shared/types/models';

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getCategories: builder.query<Categoria[], void>({
      query: () => '/categorias',
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;

export function flattenCategories(cats: Categoria[]): { id: number; nombre: string; descripcion: string | null; nivel: number }[] {
  const result: { id: number; nombre: string; descripcion: string | null; nivel: number }[] = [];
  const walk = (list: Categoria[], nivel: number) => {
    for (const c of list) {
      result.push({ id: c.id, nombre: c.nombre, descripcion: c.descripcion, nivel });
      if (c.subcategorias?.length) walk(c.subcategorias, nivel + 1);
    }
  };
  walk(cats, 0);
  return result;
}
