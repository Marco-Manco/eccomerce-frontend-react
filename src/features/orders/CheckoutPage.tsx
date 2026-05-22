import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetCartQuery, useClearCartMutation } from '../cart/cartApi';
import { formatCurrency } from '../../shared/utils/constants';
import { CreditCard, MapPin, Plus } from 'lucide-react';

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

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: carrito, isLoading } = useGetCartQuery();
  const [clearCart] = useClearCartMutation();
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [direccionEnvioId, setDireccionEnvioId] = useState<number | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState('');
  const [loadingDirs, setLoadingDirs] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/api/usuarios/me/direcciones', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json()).then((dirs) => {
      setDirecciones(dirs);
      if (dirs.length > 0) setDireccionEnvioId(dirs[0].id);
      setLoadingDirs(false);
    });
  }, []);

  if (isLoading || loadingDirs) return <p className="text-center py-20 text-gray-400">Cargando...</p>;
  if (!carrito || carrito.items.length === 0) {
    navigate('/carrito');
    return null;
  }

  const handleCheckout = async () => {
    if (!direccionEnvioId) {
      setError('Seleccioná una dirección de envío');
      return;
    }
    setCheckingOut(true);
    setError('');
    try {
      const resp = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ direccionEnvioId }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.mensaje || 'Error al crear pedido');
      }

      const pedido = await resp.json();
      await clearCart().unwrap();

      if (pedido.linkPago) {
        window.location.href = pedido.linkPago;
      } else {
        navigate('/pedidos');
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar el checkout');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Finalizar compra</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4">{error}</div>
      )}

      {/* Resumen */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-semibold mb-4">Resumen del pedido</h2>
        <div className="space-y-2">
          {carrito.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.productoNombre} {item.variante && `(${item.variante})`} x{item.cantidad}</span>
              <span className="font-medium">{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
        </div>
        <hr className="my-4" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatCurrency(carrito.total)}</span>
        </div>
      </div>

      {/* Dirección */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold flex items-center gap-2"><MapPin size={18} /> Dirección de envío</h2>
          <Link to="/perfil" className="text-purple-600 text-sm hover:underline flex items-center gap-1">
            <Plus size={14} /> Gestionar direcciones
          </Link>
        </div>

        {direcciones.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-400 mb-3">No tenés direcciones guardadas</p>
            <Link to="/perfil" className="text-purple-600 hover:underline">Agregar una dirección</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {direcciones.map((d) => (
              <label key={d.id}
                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition
                  ${direccionEnvioId === d.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
                <input type="radio" name="direccion" value={d.id}
                  checked={direccionEnvioId === d.id}
                  onChange={() => setDireccionEnvioId(d.id)} className="mt-1" />
                <div>
                  <p className="font-medium">{d.calle} {d.numero}{d.piso ? `, ${d.piso}` : ''}</p>
                  <p className="text-sm text-gray-500">{d.ciudad}, {d.provincia}, CP {d.codigoPostal}</p>
                  {d.telefono && <p className="text-sm text-gray-400">{d.telefono}</p>}
                  {d.esPrincipal && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded mt-1 inline-block">Principal</span>}
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      <button onClick={handleCheckout} disabled={checkingOut || direcciones.length === 0}
        className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
        <CreditCard size={20} />
        {checkingOut ? 'Creando pedido...' : 'Confirmar y pagar con MercadoPago'}
      </button>
    </div>
  );
}
