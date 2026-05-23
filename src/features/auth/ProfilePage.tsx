import { useState, useEffect } from 'react';
import { useAppSelector } from '../../app/store';
import { Plus, Pencil, Trash2, MapPin, User } from 'lucide-react';
import { API_BASE } from '../../shared/utils/constants';

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

export default function ProfilePage() {
  const { user } = useAppSelector((s) => s.auth);
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
    const resp = await fetch(API_BASE + '/api/usuarios/me/direcciones', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (resp.ok) setDirecciones(await resp.json());
    setLoading(false);
  };

  useEffect(() => { fetchDirecciones(); }, []);

  const resetForm = () => {
    setCalle(''); setNumero(''); setPiso(''); setCiudad(''); setProvincia('');
    setCodigoPostal(''); setTelefono(''); setEditId(null); setShowForm(false); setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editId ? `${API_BASE}/api/usuarios/me/direcciones/${editId}` : `${API_BASE}/api/usuarios/me/direcciones`;
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
    await fetch(`${API_BASE}/api/usuarios/me/direcciones/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchDirecciones();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Perfil */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <User size={28} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{user?.nombre}</h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
          <div>
            <span className="text-gray-400">Rol</span>
            <p className="font-medium">{user?.rol === 'ADMIN' ? 'Administrador' : 'Cliente'}</p>
          </div>
        </div>
      </div>

      {/* Direcciones */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><MapPin size={18} /> Mis direcciones</h2>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="bg-purple-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-purple-700 flex items-center gap-1">
            <Plus size={16} /> {showForm ? 'Cancelar' : 'Nueva'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="border rounded-lg p-4 mb-4 space-y-3 bg-gray-50">
            <h3 className="font-semibold text-sm">{editId ? 'Editar dirección' : 'Nueva dirección'}</h3>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Calle *" value={calle} onChange={(e) => setCalle(e.target.value)} className="border rounded px-3 py-2 text-sm" required />
              <input placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} className="border rounded px-3 py-2 text-sm" />
              <input placeholder="Piso / Depto" value={piso} onChange={(e) => setPiso(e.target.value)} className="border rounded px-3 py-2 text-sm" />
              <input placeholder="Ciudad *" value={ciudad} onChange={(e) => setCiudad(e.target.value)} className="border rounded px-3 py-2 text-sm" required />
              <input placeholder="Provincia *" value={provincia} onChange={(e) => setProvincia(e.target.value)} className="border rounded px-3 py-2 text-sm" required />
              <input placeholder="Código Postal *" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} className="border rounded px-3 py-2 text-sm" required />
              <input placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="border rounded px-3 py-2 text-sm" />
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
              {editId ? 'Actualizar' : 'Agregar dirección'}
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-gray-400 text-sm">Cargando...</p>
        ) : direcciones.length === 0 ? (
          <p className="text-gray-400 text-sm">No tenés direcciones guardadas.</p>
        ) : (
          <div className="space-y-2">
            {direcciones.map((d) => (
              <div key={d.id} className="border rounded-lg p-3 flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{d.calle} {d.numero}{d.piso ? `, ${d.piso}` : ''}</p>
                  <p className="text-xs text-gray-500">{d.ciudad}, {d.provincia}, CP {d.codigoPostal}</p>
                  {d.telefono && <p className="text-xs text-gray-400">{d.telefono}</p>}
                  {d.esPrincipal && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded mt-1 inline-block">Principal</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditId(d.id); setCalle(d.calle); setNumero(d.numero || ''); setPiso(d.piso || ''); setCiudad(d.ciudad); setProvincia(d.provincia); setCodigoPostal(d.codigoPostal); setTelefono(d.telefono || ''); setShowForm(true); }}
                    className="text-gray-400 hover:text-purple-600 p-1"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(d.id)} className="text-gray-400 hover:text-red-600 p-1"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
