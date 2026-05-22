import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from './productsApi';
import ProductCard from './components/ProductCard';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../shared/utils/constants';

export default function ProductList() {
  const [nombre, setNombre] = useState('');
  const [page, setPage] = useState(0);
  const [slide, setSlide] = useState(0);

  const { data: productosData, isLoading } = useGetProductsQuery({ nombre: nombre || undefined, page, size: 12 });

  // Carrusel: primeros productos con imagen
  const destacados = (productosData?.content ?? []).filter((p) => p.imagenPrincipal).slice(0, 5);

  useEffect(() => {
    if (destacados.length === 0) return;
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % destacados.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [destacados.length]);

  return (
    <div>
      {/* ──────── HERO ──────── */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-2xl p-8 md:p-14 mb-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Tejidos artesanales, <br />hechos con amor 🧶
          </h1>
          <p className="text-purple-100 text-lg mb-6">
            Bufandas, abrigos, muñecos y más. Cada prenda es única, tejida a mano con los mejores materiales.
          </p>
          <div className="flex gap-3">
            <a href="#productos" className="bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition">
              Ver productos
            </a>
            <Link to="/login" className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* ──────── CARRUSEL DESTACADOS ──────── */}
      {destacados.length > 0 && (
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Productos destacados</h2>
            <div className="flex gap-1">
              <button onClick={() => setSlide((s) => (s - 1 + destacados.length) % destacados.length)}
                className="p-1 rounded hover:bg-gray-200">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setSlide((s) => (s + 1) % destacados.length)}
                className="p-1 rounded hover:bg-gray-200">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="relative bg-white rounded-xl shadow overflow-hidden">
            {destacados.map((p, i) => (
              <Link
                key={p.id}
                to={`/productos/${p.id}`}
                className={`grid grid-cols-1 md:grid-cols-2 transition-opacity duration-500 ${
                  i === slide ? 'block' : 'hidden'
                }`}
              >
                <div className="h-64 md:h-80 bg-gray-100">
                  <img src={p.imagenPrincipal!} alt={p.nombre} className="w-full h-full object-cover" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <p className="text-sm text-purple-600 uppercase tracking-wide">{p.categoria}</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">{p.nombre}</h3>
                  <p className="text-gray-500 mt-2 line-clamp-3">{p.descripcion}</p>
                  <p className="text-3xl font-bold text-purple-700 mt-4">{formatCurrency(p.precioDesde)}</p>
                </div>
              </Link>
            ))}

            {/* Dots */}
            {destacados.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {destacados.map((_, i) => (
                  <button key={i} onClick={() => setSlide(i)}
                    className={`w-2.5 h-2.5 rounded-full transition ${i === slide ? 'bg-purple-600' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ──────── BUSCADOR ──────── */}
      <div id="productos" className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800 whitespace-nowrap">Catálogo</h2>
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" placeholder="Buscar productos..." value={nombre}
            onChange={(e) => { setNombre(e.target.value); setPage(0); }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* ──────── GRILLA ──────── */}
      {isLoading ? (
        <p className="text-center text-gray-400 py-20">Cargando productos...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productosData?.content.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>

          {productosData && productosData.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: productosData.totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i)}
                  className={`px-3 py-1 rounded ${i === page ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          {productosData?.content.length === 0 && (
            <p className="text-center text-gray-400 py-20">No se encontraron productos.</p>
          )}
        </>
      )}
    </div>
  );
}
