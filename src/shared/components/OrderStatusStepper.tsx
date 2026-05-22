const STEPS = ['PENDIENTE', 'PAGADO', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO'] as const;
const LABELS: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  PAGADO: 'Pagado',
  EN_PREPARACION: 'En preparación',
  ENVIADO: 'Enviado',
  ENTREGADO: 'Entregado',
};

interface Props {
  estadoActual: string;
  isCancelado?: boolean;
}

export default function OrderStatusStepper({ estadoActual, isCancelado }: Props) {
  if (isCancelado) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-red-200 rounded-full relative">
          <div className="absolute inset-0 bg-red-500 rounded-full" style={{ width: '100%' }} />
        </div>
        <span className="text-sm font-bold text-red-600 whitespace-nowrap">CANCELADO</span>
      </div>
    );
  }

  const currentIdx = STEPS.indexOf(estadoActual as any);
  if (currentIdx === -1) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        {STEPS.map((step, i) => {
          let bg = 'bg-gray-200';
          if (i < currentIdx) bg = 'bg-green-500';
          else if (i === currentIdx) bg = 'bg-purple-500';
          return (
            <div key={step} className="flex-1 flex items-center gap-1">
              <div className={`h-2 rounded-full flex-1 ${bg}`} />
              {i < STEPS.length - 1 && <div className="w-1" />}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        {STEPS.map((step, i) => (
          <span key={step} className={i <= currentIdx ? 'font-semibold text-gray-700' : ''}>
            {LABELS[step]}
          </span>
        ))}
      </div>
    </div>
  );
}
