import { useState } from 'react';
import { useGetOrdersQuery } from './ordersApi';
import { formatCurrency, formatDate } from '../../shared/utils/constants';
import OrderStatusStepper from '../../shared/components/OrderStatusStepper';
import type { Pedido } from '../../shared/types/models';

export default function OrderHistory() {
  const { data, isLoading } = useGetOrdersQuery({});
  const [modalPedido, setModalPedido] = useState<Pedido | null>(null);

  if (isLoading) return <p className="text-center py-20">Cargando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mis pedidos</h1>
      {!data?.content.length ? (
        <p className="text-gray-400">No tenés pedidos todavía.</p>
      ) : (
        <div className="space-y-4">
          {data.content.map((pedido) => (
            <div key={pedido.id} className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition"
              onClick={() => setModalPedido(pedido)}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{pedido.numeroPedido}</p>
                  <p className="text-sm text-gray-500">{formatDate(pedido.fechaCreacion)}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold
                    ${pedido.estado === 'PAGADO' ? 'bg-green-100 text-green-700' :
                      pedido.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-700' :
                      pedido.estado === 'CANCELADO' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'}`}>
                    {pedido.estado}
                  </span>
                  <p className="text-lg font-bold mt-1">{formatCurrency(pedido.total)}</p>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                {pedido.items.map((item) => (
                  <p key={item.id}>{item.productoNombre} {item.varianteDescripcion && `(${item.varianteDescripcion})`} x{item.cantidad}</p>
                ))}
              </div>
              {pedido.linkPago && pedido.estado === 'PENDIENTE' && (
                <a href={pedido.linkPago} target="_blank" rel="noopener" className="inline-block mt-2 bg-purple-600 text-white text-sm px-4 py-1 rounded hover:bg-purple-700">
                  Pagar ahora
                </a>
              )}
            </div>
          ))}
        </div>
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
