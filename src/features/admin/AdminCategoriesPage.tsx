import { useState } from 'react';
import { useGetCategoriesQuery, flattenCategories } from './categoriesApi';
import { Pencil, Plus } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { data: categorias, isLoading, refetch } = useGetCategoriesQuery();
  const cats = categorias ? flattenCategories(categorias) : [];

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaPadreId, setCategoriaPadreId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setNombre(''); setDescripcion(''); setCategoriaPadreId(''); setEditId(null); setShowForm(false); setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const url = editId ? `/api/admin/categorias/${editId}` : '/api/admin/categorias';
      const method = editId ? 'PUT' : 'POST';
      const body: any = { nombre, descripcion: descripcion || undefined };
      if (categoriaPadreId) body.categoriaPadreId = Number(categoriaPadreId);
      else if (!editId) body.categoriaPadreId = null;

      const resp = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.mensaje || 'Error');
      }

      reset();
      refetch();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <p className="text-center py-20 text-gray-400">Cargando categorías...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Panel Admin — Categorías</h1>
        <button onClick={() => { reset(); setShowForm(!showForm); }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-1">
          <Plus size={18} /> {showForm ? 'Cancelar' : 'Nueva categoría'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-lg">{editId ? 'Editar categoría' : 'Nueva categoría'}</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Nombre *</span>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2" required />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Categoría padre</span>
              <select value={categoriaPadreId} onChange={(e) => setCategoriaPadreId(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2 bg-white">
                <option value="">— Ninguna (raíz) —</option>
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
          <button type="submit" disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50">
            {saving ? 'Guardando...' : editId ? 'Actualizar' : 'Crear categoría'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-sm text-gray-500">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">
                  <span style={{ paddingLeft: c.nivel * 16 }}>{c.nivel > 0 ? '↳ ' : ''}{c.nombre}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{c.descripcion || '—'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => { setEditId(c.id); setNombre(c.nombre); setShowForm(true); }}
                    className="text-purple-600 hover:text-purple-800">
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
