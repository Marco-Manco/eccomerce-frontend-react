import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import { productsApi } from '../features/products/productsApi';
import { cartApi } from '../features/cart/cartApi';
import { ordersApi } from '../features/orders/ordersApi';
import { authApi } from '../features/auth/authApi';
import { adminApi } from '../features/admin/adminApi';
import { categoriesApi } from '../features/admin/categoriesApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productsApi.middleware,
      cartApi.middleware,
      ordersApi.middleware,
      authApi.middleware,
      adminApi.middleware,
      categoriesApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
