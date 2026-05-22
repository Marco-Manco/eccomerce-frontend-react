import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { logout } from '../../features/auth/authSlice';
import { useGetCartQuery } from '../../features/cart/cartApi';
import { ShoppingCart, Package, LogIn } from 'lucide-react';

export default function Navbar() {
  const { token, user } = useAppSelector((s) => s.auth);
  const { data: carrito } = useGetCartQuery(undefined, { skip: !token });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const totalItems = carrito?.totalItems ?? 0;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-purple-700">
          🧵 Tejidos
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {user?.rol === 'ADMIN' && (
            <>
              <Link to="/admin/pedidos" className="text-gray-600 hover:text-purple-700 text-sm">Pedidos</Link>
              <Link to="/admin/productos" className="text-gray-600 hover:text-purple-700 text-sm">Productos</Link>
              <Link to="/admin/categorias" className="text-gray-600 hover:text-purple-700 text-sm">Categorías</Link>
            </>
          )}

          {token ? (
            <>
              {user?.rol !== 'ADMIN' && (
                <>
                  <Link to="/pedidos" className="text-gray-600 hover:text-purple-700 flex items-center gap-1">
                    <Package size={16} /> Pedidos
                  </Link>
                  <Link to="/carrito" className="text-gray-600 hover:text-purple-700 flex items-center gap-1 relative">
                    <ShoppingCart size={16} /> Carrito
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                  <span className="text-gray-400">|</span>
                </>
              )}
              <Link to="/perfil" className="text-gray-700 hover:text-purple-700">{user?.nombre}</Link>
              <button onClick={() => { dispatch(logout()); navigate('/'); }} className="text-red-500 hover:underline">
                Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="text-purple-700 hover:underline flex items-center gap-1">
              <LogIn size={16} /> Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
