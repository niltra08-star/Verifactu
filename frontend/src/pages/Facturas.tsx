import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Ban } from 'lucide-react';
import { api, type FacturaResponse } from '../api/client';

export default function Facturas() {
  const [facturas, setFacturas] = useState<FacturaResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = () => {
    setLoading(true);
    api.facturas.list()
      .then(setFacturas)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const anular = async (id: number) => {
    if (!confirm('Anular esta factura?')) return;
    await api.facturas.anular(id);
    cargar();
  };

  const estadoBadge = (estado: string) => {
    switch (estado) {
      case 'EMITIDA': return <span className="badge badge-success">Emitida</span>;
      case 'COBRADA': return <span className="badge badge-success">Cobrada</span>;
      case 'ANULADA': return <span className="badge badge-neutral">Anulada</span>;
      case 'VERIFICADA': return <span className="badge badge-warning">Verificada AEAT</span>;
      default: return <span className="badge badge-neutral">{estado}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-white/20 border-t-accent-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Facturas</h1>
          <p className="text-text-secondary text-sm">{facturas.length} facturas emitidas</p>
        </div>
        <Link to="/facturas/nueva" className="btn-gold text-sm">
          <Plus size={18} />
          Nueva factura
        </Link>
      </div>

      {facturas.length === 0 ? (
        <div className="card p-12 text-center">
          <FileTextIcon className="mx-auto mb-4 text-text-tertiary" />
          <h3 className="text-lg font-semibold mb-2">No hay facturas todavia</h3>
          <p className="text-text-secondary text-sm mb-6">Crea tu primera factura Verifactu gratis</p>
          <Link to="/facturas/nueva" className="btn-gold text-sm">Crear factura</Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/6">
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Nº</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Cliente</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Fecha</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Total</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Estado</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Verifactu</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((f) => (
                <tr key={f.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium">{f.numeroFactura}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{f.clienteNombre}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{new Date(f.fechaEmision).toLocaleDateString('es-ES')}</td>
                  <td className="py-3 px-4 text-sm text-right font-semibold">{f.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</td>
                  <td className="py-3 px-4 text-center">{estadoBadge(f.estado)}</td>
                  <td className="py-3 px-4 text-center">
                    {f.verifactuEnviada ? (
                      <span className="badge badge-success text-[10px]">Registrada</span>
                    ) : (
                      <span className="badge badge-neutral text-[10px]">Pendiente</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="btn-outline !p-1.5" title="Ver detalle">
                        <Eye size={14} />
                      </button>
                      {f.estado !== 'ANULADA' && (
                        <button className="btn-outline !p-1.5 hover:text-red-400 hover:border-red-400/20" title="Anular" onClick={() => anular(f.id)}>
                          <Ban size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
