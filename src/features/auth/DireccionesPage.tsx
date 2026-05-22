import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';

interface Direccion {
  id: number;
  calle: string;
  numero: string | null;
  piso: string | null;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  telefono: string | null;
  esPrincipal: boolean;
}

export default function DireccionesPage() {
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [piso, setPiso] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [provincia, setProvincia] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [telefono, setTelefono] = useState('');

  const token = localStorage.getItem('token');

  const fetchDirecciones = async () => {
    const resp = await fetch('/api/usuarios/me/direcciones', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (resp.ok) setDirecciones(await resp.json());
    setLoading(false);
  };

  useEffect(() => { fetchDirecciones(); }, []);

  const resetForm = () => {
    setCalle(''); setNumero(''); setPiso(''); setCiudad('');
    setProvincia(''); setCodigoPostal(''); setTelefono('');
    setEditId(null); setShowForm(false); setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editId
      ? `/api/usuarios/me/direcciones/${editId}`
      : '/api/usuarios/me/direcciones';
    const method = editId ? 'PUT' : 'POST';

    const resp = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ calle, numero, piso, ciudad, provincia, codigoPostal, telefono }),
    });

    if (!resp.ok) {
      const err = await resp.json();
      setError(err.mensaje || 'Error');
      return;
    }

    resetForm();
    fetchDirecciones();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/usuarios/me/direcciones/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchDirecciones();
  };

  if (loading) return <p className="text-center py-20 text-gray-400">Cargando...</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis direcciones</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-1">
          <Plus size={18} /> {showForm ? 'Cancelar' : 'Nueva'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 space-y-3">
          <h2 className="font-semibold">{editId ? 'Editar dirección' : 'Nueva dirección'}</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input placeholder="Calle *" value={calle} onChange={(e) => setCalle(e.target.value)} className="border rounded px-3 py-2" required />
            <input placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} className="border rounded px-3 py-2" />
            <input placeholder="Piso / Depto" value={piso} onChange={(e) => setPiso(e.target.value)} className="border rounded px-3 py-2" />
            <input placeholder="Ciudad *" value={ciudad} onChange={(e) => setCiudad(e.target.value)} className="border rounded px-3 py-2" required />
            <input placeholder="Provincia *" value={provincia} onChange={(e) => setProvincia(e.target.value)} className="border rounded px-3 py-2" required />
            <input placeholder="Código Postal *" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} className="border rounded px-3 py-2" required />
            <input placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="border rounded px-3 py-2" />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            {editId ? 'Actualizar' : 'Agregar dirección'}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {direcciones.map((d) => (
          <div key={d.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-start">
            <div>
              <p className="font-medium">{d.calle} {d.numero}{d.piso ? `, ${d.piso}` : ''}</p>
              <p className="text-sm text-gray-500">{d.ciudad}, {d.provincia}, CP {d.codigoPostal}</p>
              {d.telefono && <p className="text-sm text-gray-400">{d.telefono}</p>}
              {d.esPrincipal && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded mt-1 inline-block">Principal</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditId(d.id); setCalle(d.calle); setNumero(d.numero || ''); setPiso(d.piso || ''); setCiudad(d.ciudad); setProvincia(d.provincia); setCodigoPostal(d.codigoPostal); setTelefono(d.telefono || ''); setShowForm(true); }}
                className="text-gray-400 hover:text-purple-600"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(d.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {direcciones.length === 0 && (
          <div className="text-center py-10">
            <MapPin size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">No tenés direcciones guardadas</p>
          </div>
        )}
      </div>
    </div>
  );
}
