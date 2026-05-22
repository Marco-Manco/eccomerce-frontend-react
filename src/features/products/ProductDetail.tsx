import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductQuery } from './productsApi';
import { useAddItemMutation } from '../cart/cartApi';
import { formatCurrency } from '../../shared/utils/constants';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: producto, isLoading } = useGetProductQuery(Number(id));
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addItem, { isLoading: adding }] = useAddItemMutation();

  if (isLoading) return <p className="text-center py-20">Cargando...</p>;
  if (!producto) return <p className="text-center py-20">Producto no encontrado</p>;

  const variante = producto.variantes.find((v) => v.id === selectedVariant);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
        {producto.imagenes[0] ? (
          <img src={producto.imagenes[0].url} alt={producto.nombre} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <span className="text-6xl">🧶</span>
        )}
      </div>

      <div>
        <p className="text-sm text-purple-600 uppercase">{producto.categoria}</p>
        <h1 className="text-3xl font-bold mt-1">{producto.nombre}</h1>
        <p className="text-gray-600 mt-2">{producto.descripcion}</p>

        {producto.precioHasta > producto.precioDesde ? (
          <p className="text-2xl font-bold text-purple-700 mt-4">
            {formatCurrency(producto.precioDesde)} - {formatCurrency(producto.precioHasta)}
          </p>
        ) : (
          <p className="text-2xl font-bold text-purple-700 mt-4">{formatCurrency(producto.precioDesde)}</p>
        )}

        <div className="mt-6">
          <p className="font-semibold mb-2">Color / Talle:</p>
          <div className="flex flex-wrap gap-2">
            {producto.variantes.map((v) => (
              <button key={v.id}
                onClick={() => setSelectedVariant(v.id)}
                disabled={v.stockDisponible === 0}
                className={`px-3 py-2 border rounded text-sm transition
                  ${selectedVariant === v.id ? 'border-purple-600 bg-purple-50' : 'border-gray-300'}
                  ${v.stockDisponible === 0 ? 'opacity-40 cursor-not-allowed line-through' : 'hover:border-purple-400'}`}>
                {[v.color, v.talle].filter(Boolean).join(' - ') || 'Único'}
                {v.stockDisponible === 0 && ' (agotado)'}
              </button>
            ))}
          </div>
        </div>

        {variante && (
          <div className="mt-4 flex items-center gap-4">
            <input type="number" min={1} max={variante.stockDisponible} value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border rounded px-3 py-2" />
            <button
              onClick={() => addItem({ varianteProductoId: variante.id, cantidad: quantity })}
              disabled={adding}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50">
              Agregar al carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
