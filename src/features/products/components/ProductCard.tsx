import { Link } from 'react-router-dom';
import type { ProductoResumen } from '../../../shared/types/models';
import { formatCurrency } from '../../../shared/utils/constants';

export default function ProductCard({ p }: { p: ProductoResumen }) {
  return (
    <Link to={`/productos/${p.id}`} className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden block">
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        {p.imagenPrincipal ? (
          <img src={p.imagenPrincipal} alt={p.nombre} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-4xl">🧶</span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-purple-600 uppercase tracking-wide">{p.categoria}</p>
        <h3 className="font-semibold text-gray-800 mt-1">{p.nombre}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.descripcion}</p>
        <p className="text-lg font-bold text-purple-700 mt-2">{formatCurrency(p.precioDesde)}</p>
      </div>
    </Link>
  );
}
