import { createBrowserRouter } from 'react-router-dom';
import Layout from '../shared/components/Layout';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import ProductList from '../features/products/ProductList';
import ProductDetail from '../features/products/ProductDetail';
import LoginPage from '../features/auth/LoginPage';
import CartPage from '../features/cart/CartPage';
import OrderHistory from '../features/orders/OrderHistory';
import CheckoutPage from '../features/orders/CheckoutPage';
import AdminProductsPage from '../features/admin/AdminProductsPage';
import AdminCategoriesPage from '../features/admin/AdminCategoriesPage';
import AdminPedidosPage from '../features/admin/AdminPedidosPage';
import ProfilePage from '../features/auth/ProfilePage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <ProductList /> },
      { path: '/productos/:id', element: <ProductDetail /> },
      { path: '/login', element: <LoginPage /> },
      {
        path: '/perfil',
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
      },
      {
        path: '/direcciones',
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
      },
      {
        path: '/carrito',
        element: <ProtectedRoute role="CLIENTE"><CartPage /></ProtectedRoute>,
      },
      {
        path: '/checkout',
        element: <ProtectedRoute role="CLIENTE"><CheckoutPage /></ProtectedRoute>,
      },
      {
        path: '/pedidos',
        element: <ProtectedRoute role="CLIENTE"><OrderHistory /></ProtectedRoute>,
      },
      {
        path: '/admin/pedidos',
        element: <ProtectedRoute role="ADMIN"><AdminPedidosPage /></ProtectedRoute>,
      },
      {
        path: '/admin/productos',
        element: <ProtectedRoute role="ADMIN"><AdminProductsPage /></ProtectedRoute>,
      },
      {
        path: '/admin/categorias',
        element: <ProtectedRoute role="ADMIN"><AdminCategoriesPage /></ProtectedRoute>,
      },
    ],
  },
]);
