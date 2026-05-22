import { useState } from 'react';
import { useCreateProductMutation } from './adminApi';
import { useGetCategoriesQuery, flattenCategories } from './categoriesApi';
import { useGetProductsQuery } from '../products/productsApi';
import ProductCard from '../products/components/ProductCard';
import EditProductForm from './components/EditProductForm';
import { Pencil, Plus } from 'lucide-react';

export default function AdminProductsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState(1);

  const [crear, { isLoading }] = useCreateProductMutation();
  const { data: categorias } = useGetCategoriesQuery();
  const cats = categorias ? flattenCategories(categorias) : [];
  const { data, refetch } = useGetProductsQuery({ size: 50 });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await crear({ nombre, descripcion, categoriaId }).unwrap();
    setNombre(''); setDescripcion(''); setShowCreate(false);
    refetch();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Panel Admin — Productos</h1>
        <button onClick={() => { setShowCreate(!showCreate); setEditingId(null); }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-1">
          <Plus size={18} /> {showCreate ? 'Cancelar' : 'Nuevo producto'}
        </button>
      </div>

      {/* Formulario crear */}
      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-lg">Nuevo producto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Nombre *</span>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2" required />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Categoría</span>
              <select value={categoriaId} onChange={(e) => setCategoriaId(Number(e.target.value))}
                className="mt-1 w-full border rounded px-3 py-2 bg-white">
                {cats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {'\u00A0\u00A0'.repeat(c.nivel)}{c.nivel > 0 ? '↳ ' : ''}{c.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Descripción</span>
              <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={2}
                className="mt-1 w-full border rounded px-3 py-2" />
            </label>
          </div>
          <button type="submit" disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50">
            Crear producto
          </button>
        </form>
      )}

      {/* Formulario editar */}
      {editingId && (
        <EditProductForm
          productoId={editingId}
          onClose={() => setEditingId(null)}
          onSaved={() => { refetch(); setEditingId(null); }}
        />
      )}

      {/* Grilla */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.content.map((p) => (
          <div key={p.id} className="relative">
            <ProductCard p={p} />
            <button onClick={() => setEditingId(p.id)}
              className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow hover:bg-gray-100"
              title="Editar producto">
              <Pencil size={16} className="text-purple-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
