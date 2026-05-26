import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { api, type Cliente } from '../api/client';

interface Linea {
  concepto: string;
  cantidad: number;
  precioUnitario: number;
  ivaPorcentaje: number;
}

export default function NuevaFactura() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    clienteId: 0,
    numeroFactura: `F${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
    fechaEmision: new Date().toISOString().split('T')[0],
    fechaVencimiento: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    ivaPorcentaje: 21,
    irpfPorcentaje: 15,
    observaciones: '',
  });

  const [lineas, setLineas] = useState<Linea[]>([
    { concepto: '', cantidad: 1, precioUnitario: 0, ivaPorcentaje: 21 },
  ]);

  useEffect(() => {
    api.clientes.list().then(setClientes).catch(console.error);
  }, []);

  const addLinea = () => {
    setLineas([...lineas, { concepto: '', cantidad: 1, precioUnitario: 0, ivaPorcentaje: 21 }]);
  };

  const removeLinea = (index: number) => {
    setLineas(lineas.filter((_, i) => i !== index));
  };

  const updateLinea = (index: number, field: keyof Linea, value: string | number) => {
    const updated = [...lineas];
    updated[index] = { ...updated[index], [field]: value };
    setLineas(updated);
  };

  const calcularTotal = () => {
    const base = lineas.reduce((sum, l) => sum + (l.cantidad || 0) * (l.precioUnitario || 0), 0);
    const iva = base * (form.ivaPorcentaje / 100);
    return { base, iva, total: base + iva };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clienteId || lineas.some(l => !l.concepto.trim())) return;

    setSubmitting(true);
    try {
      await api.facturas.create({
        clienteId: form.clienteId,
        numeroFactura: form.numeroFactura,
        fechaEmision: form.fechaEmision,
        fechaVencimiento: form.fechaVencimiento,
        ivaPorcentaje: form.ivaPorcentaje,
        irpfPorcentaje: form.irpfPorcentaje,
        observaciones: form.observaciones,
        lineas: lineas.map((l) => ({
          concepto: l.concepto,
          cantidad: l.cantidad,
          precioUnitario: l.precioUnitario,
          ivaPorcentaje: l.ivaPorcentaje,
        })),
      });
      navigate('/facturas');
    } catch (err) {
      console.error(err);
      alert('Error al crear la factura');
    } finally {
      setSubmitting(false);
    }
  };

  const { base, iva, total } = calcularTotal();

  return (
    <div>
      <button onClick={() => navigate('/facturas')} className="btn-outline mb-6">
        <ArrowLeft size={16} />
        Volver a facturas
      </button>

      <h1 className="text-2xl font-extrabold tracking-tight mb-8">Nueva factura Verifactu</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">Datos de la factura</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">Cliente</label>
              <select
                className="input-field"
                value={form.clienteId}
                onChange={(e) => setForm({ ...form, clienteId: Number(e.target.value) })}
                required
              >
                <option value={0}>Seleccionar cliente...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre} {c.nif && `(${c.nif})`}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">Nº Factura</label>
              <input
                className="input-field"
                value={form.numeroFactura}
                onChange={(e) => setForm({ ...form, numeroFactura: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">Fecha emision</label>
              <input type="date" className="input-field" value={form.fechaEmision}
                onChange={(e) => setForm({ ...form, fechaEmision: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">Vencimiento</label>
              <input type="date" className="input-field" value={form.fechaVencimiento}
                onChange={(e) => setForm({ ...form, fechaVencimiento: e.target.value })} required />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider">Lineas de factura</h2>
            <button type="button" onClick={addLinea} className="btn-outline">
              <Plus size={14} /> Anadir linea
            </button>
          </div>

          <div className="space-y-3">
            {lineas.map((linea, i) => (
              <div key={i} className="flex gap-3 items-start">
                <input
                  className="input-field flex-1"
                  placeholder="Concepto"
                  value={linea.concepto}
                  onChange={(e) => updateLinea(i, 'concepto', e.target.value)}
                  required
                />
                <input
                  className="input-field w-20"
                  type="number"
                  placeholder="Cant."
                  value={linea.cantidad}
                  onChange={(e) => updateLinea(i, 'cantidad', Number(e.target.value))}
                  min={1}
                />
                <input
                  className="input-field w-28"
                  type="number"
                  step="0.01"
                  placeholder="Precio"
                  value={linea.precioUnitario}
                  onChange={(e) => updateLinea(i, 'precioUnitario', Number(e.target.value))}
                  min={0}
                />
                <span className="text-text-secondary text-sm py-3 whitespace-nowrap">
                  {(linea.cantidad * linea.precioUnitario).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                </span>
                {lineas.length > 1 && (
                  <button type="button" onClick={() => removeLinea(i)} className="p-3 text-text-tertiary hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/6">
            <div className="grid grid-cols-2 gap-4 max-w-sm ml-auto text-sm">
              <div className="flex justify-between"><span className="text-text-tertiary">Base imponible</span><span>{base.toFixed(2)} €</span></div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">IVA ({form.ivaPorcentaje}%)</span>
                <span>{iva.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between col-span-2 pt-2 border-t border-white/6 font-bold text-base">
                <span>Total</span>
                <span className="text-accent-gold-light">{total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">Impuestos y observaciones</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">IVA %</label>
              <select className="input-field" value={form.ivaPorcentaje}
                onChange={(e) => setForm({ ...form, ivaPorcentaje: Number(e.target.value) })}>
                <option value={21}>21% - General</option>
                <option value={10}>10% - Reducido</option>
                <option value={4}>4% - Superreducido</option>
                <option value={0}>0% - Exento</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">IRPF %</label>
              <select className="input-field" value={form.irpfPorcentaje}
                onChange={(e) => setForm({ ...form, irpfPorcentaje: Number(e.target.value) })}>
                <option value={15}>15% - General</option>
                <option value={7}>7% - Nuevos autonomos</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">Observaciones</label>
              <input className="input-field" placeholder="Opcional" value={form.observaciones}
                onChange={(e) => setForm({ ...form, observaciones: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/facturas')} className="btn-outline">
            Cancelar
          </button>
          <button type="submit" className="btn-gold" disabled={submitting}>
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-bg-deep/30 border-t-bg-deep rounded-full animate-spin" />
                Creando...
              </>
            ) : (
              'Emitir factura Verifactu'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
