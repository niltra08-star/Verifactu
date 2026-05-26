import { useEffect, useState } from 'react';
import { FileText, Users, TrendingUp, Euro } from 'lucide-react';
import { api, type DashboardResponse } from '../api/client';

export default function Dashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-white/20 border-t-accent-gold rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data ? [
    { icon: FileText, label: 'Facturas totales', value: data.totalFacturas.toLocaleString(), color: 'text-accent-blue' },
    { icon: Users, label: 'Clientes', value: data.totalClientes.toLocaleString(), color: 'text-accent-green' },
    { icon: Euro, label: 'Total facturado', value: `${data.totalFacturado.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`, color: 'text-accent-gold-light' },
    { icon: TrendingUp, label: 'Facturas este mes', value: data.facturasEsteMes.toString(), color: 'text-accent-green' },
  ] : [];

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight mb-2">Dashboard</h1>
      <p className="text-text-secondary text-sm mb-8">Resumen de tu actividad de facturacion</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="card p-6">
            <stat.icon size={20} className={`mb-3 ${stat.color}`} />
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">Impuestos pendientes</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">IVA repercutido</span>
                <span className="font-bold text-accent-gold-light">{data.ivaPendiente.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">IRPF retenido</span>
                <span className="font-bold text-accent-blue">{data.irpfPendiente.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</span>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">Facturacion del mes</h3>
            <div className="stat-value text-accent-green">{data.facturadoEsteMes.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</div>
            <div className="stat-label">Total facturado este mes</div>
          </div>
        </div>
      )}
    </div>
  );
}
