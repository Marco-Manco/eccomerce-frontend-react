import { useState } from 'react';
import { useGetAdminOrdersQuery, useUpdateOrderStatusMutation } from './adminApi';
import { formatCurrency, formatDate } from '../../shared/utils/constants';
import { Search } from 'lucide-react';
import OrderStatusStepper from '../../shared/components/OrderStatusStepper';
import type { Pedido } from '../../shared/types/models';

const STATE_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'PAGADO', label: 'Pagado' },
  { value: 'EN_PREPARACION', label: 'En preparación' },
  { value: 'ENVIADO', label: 'Enviado' },
  { value: 'ENTREGADO', label: 'Entregado' },
  { value: 'CANCELADO', label: 'Cancelado' },
];

export default function AdminPedidosPage() {
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('');
  const [page, setPage] = useState(0);
  const [modalPedido, setModalPedido] = useState<Pedido | null>(null);

  const { data, isLoading } = useGetAdminOrdersQuery({ search: search || undefined, estado: estado || undefined, page, size: 15 });
  const [updateStatus] = useUpdateOrderStatusMutation();

  const handleStatusChange = async (id: number, nuevoEstado: string) => {
    try {
      await updateStatus({ id, estado: nuevoEstado }).unwrap();
    } catch (e) {
      alert('Error al cambiar estado');
    }
  };

  const getStatusBadge = (estado: string) => {
    const colors: Record<string, string> = {
      PENDIENTE: 'bg-yellow-100 text-yellow-700',
      PAGADO: 'bg-green-100 text-green-700',
      EN_PREPARACION: 'bg-blue-100 text-blue-700',
      ENVIADO: 'bg-purple-100 text-purple-700',
      ENTREGADO: 'bg-emerald-100 text-emerald-700',
      CANCELADO: 'bg-red-100 text-red-700',
    };
    return `inline-block px-2 py-0.5 rounded text-xs font-semibold ${colors[estado] || 'bg-gray-100'}`;
  };

  const getNextStates = (estado: string) => {
    switch (estado) {
      case 'PAGADO': return ['EN_PREPARACION'];
      case 'EN_PREPARACION': return ['ENVIADO'];
      case 'ENVIADO': return ['ENTREGADO'];
      case 'PENDIENTE': return ['CANCELADO'];
      default: return [];
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Panel Admin — Pedidos</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Buscar # pedido..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-8 pr-3 py-2 border rounded-lg text-sm w-48" />
        </div>
        <select value={estado} onChange={(e) => { setEstado(e.target.value); setPage(0); }}
          className="border rounded-lg px-3 py-2 text-sm">
          {STATE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Tabla */}
      {isLoading ? (
        <p className="text-center text-gray-400 py-10">Cargando...</p>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-4 py-3">Pedido</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {data?.content.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{p.numeroPedido}</td>
                    <td className="px-4 py-3">Cliente #{p.id}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(p.total)}</td>
                    <td className="px-4 py-3"><span className={getStatusBadge(p.estado)}>{p.estado}</span></td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(p.fechaCreacion)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => setModalPedido(p)}
                          className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Ver</button>
                        {getNextStates(p.estado).map((ns) => (
                          <button key={ns} onClick={() => handleStatusChange(p.id, ns)}
                            className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200">
                            {ns === 'CANCELADO' ? 'Cancelar' : ns === 'EN_PREPARACION' ? 'Preparar' : ns === 'ENVIADO' ? 'Enviar' : 'Entregar'}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: data.totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i)}
                  className={`px-3 py-1 rounded text-sm ${i === page ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          {data?.content.length === 0 && (
            <p className="text-center text-gray-400 py-10">No se encontraron pedidos.</p>
          )}
        </>
      )}

      {/* Modal Stepper */}
      {modalPedido && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModalPedido(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{modalPedido.numeroPedido}</h2>
              <button onClick={() => setModalPedido(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>

            <div className="space-y-2 mb-4">
              {modalPedido.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.productoNombre} {item.varianteDescripcion && `(${item.varianteDescripcion})`} x{item.cantidad}</span>
                  <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
              <hr />
              <div className="flex justify-between font-bold">Total: {formatCurrency(modalPedido.total)}</div>
            </div>

            <div className="border-t pt-4">
              <OrderStatusStepper estadoActual={modalPedido.estado} isCancelado={modalPedido.estado === 'CANCELADO'} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
