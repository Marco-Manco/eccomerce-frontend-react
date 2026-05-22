import { useNavigate } from 'react-router-dom';
import { useGetCartQuery, useUpdateItemMutation, useRemoveItemMutation } from './cartApi';
import { formatCurrency } from '../../shared/utils/constants';
import { Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const { data: carrito, isLoading } = useGetCartQuery();
  const [updateItem] = useUpdateItemMutation();
  const [removeItem] = useRemoveItemMutation();

  if (isLoading) {
    return <p className="text-center py-20 text-gray-400">Cargando carrito...</p>;
  }

  if (!carrito || carrito.items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-400 text-lg">Tu carrito está vacío</p>
        <button onClick={() => navigate('/')} className="mt-4 text-purple-600 hover:underline">
          Ver productos
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Carrito de compras</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-sm text-gray-500">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Cantidad</th>
              <th className="px-4 py-3">Subtotal</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {carrito.items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">
                  <p className="font-semibold">{item.productoNombre}</p>
                  <p className="text-sm text-gray-500">{item.variante || item.sku}</p>
                </td>
                <td className="px-4 py-3">{formatCurrency(item.precioUnitario)}</td>
                <td className="px-4 py-3">
                  <input type="number" min={1} value={item.cantidad}
                    onChange={(e) => updateItem({ id: item.id, cantidad: Number(e.target.value) })}
                    className="w-16 border rounded px-2 py-1 text-center" />
                </td>
                <td className="px-4 py-3 font-semibold">{formatCurrency(item.subtotal)}</td>
                <td className="px-4 py-3">
                  <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div>
          <p className="text-sm text-gray-500">{carrito.totalItems} productos</p>
          <p className="text-2xl font-bold text-purple-700">{formatCurrency(carrito.total)}</p>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
          Ir al checkout
        </button>
      </div>
    </div>
  );
}
