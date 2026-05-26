import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api, type Cliente } from '../api/client';

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);

  const [form, setForm] = useState({ nombre: '', nif: '', email: '', direccion: '', ciudad: '', telefono: '' });

  const cargar = () => {
    setLoading(true);
    api.clientes.list()
      .then(setClientes)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const resetForm = () => {
    setForm({ nombre: '', nif: '', email: '', direccion: '', ciudad: '', telefono: '' });
    setEditando(null);
    setShowForm(false);
  };

  const editar = (c: Cliente) => {
    setForm({ nombre: c.nombre, nif: c.nif || '', email: c.email || '', direccion: c.direccion || '', ciudad: c.ciudad || '', telefono: c.telefono || '' });
    setEditando(c);
    setShowForm(true);
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;

    try {
      if (editando) {
        await api.clientes.update(editando.id, form);
      } else {
        await api.clientes.create(form);
      }
      resetForm();
      cargar();
    } catch (err) {
      console.error(err);
    }
  };

  const eliminar = async (id: number) => {
    if (!confirm('Eliminar este cliente?')) return;
    await api.clientes.delete(id);
    cargar();
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
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Clientes</h1>
          <p className="text-text-secondary text-sm">{clientes.length} clientes registrados</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-gold text-sm">
          <Plus size={18} /> Nuevo cliente
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">
            {editando ? 'Editar cliente' : 'Nuevo cliente'}
          </h2>
          <form onSubmit={guardar} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input className="input-field" placeholder="Nombre *" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            <input className="input-field" placeholder="NIF/CIF" value={form.nif}
              onChange={(e) => setForm({ ...form, nif: e.target.value })} />
            <input className="input-field" placeholder="Email" type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="input-field" placeholder="Direccion" value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
            <input className="input-field" placeholder="Ciudad" value={form.ciudad}
              onChange={(e) => setForm({ ...form, ciudad: e.target.value })} />
            <input className="input-field" placeholder="Telefono" value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-3">
              <button type="button" onClick={resetForm} className="btn-outline">Cancelar</button>
              <button type="submit" className="btn-gold text-sm">{editando ? 'Guardar' : 'Crear cliente'}</button>
            </div>
          </form>
        </div>
      )}

      {clientes.length === 0 ? (
        <div className="card p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No hay clientes todavia</h3>
          <p className="text-text-secondary text-sm mb-6">Anade tu primer cliente para empezar a facturar</p>
          <button onClick={() => setShowForm(true)} className="btn-gold text-sm">Crear cliente</button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/6">
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Nombre</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">NIF</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider hidden lg:table-cell">Ciudad</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium">{c.nombre}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{c.nif || '-'}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary hidden sm:table-cell">{c.email || '-'}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary hidden lg:table-cell">{c.ciudad || '-'}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => editar(c)} className="btn-outline !p-1.5" title="Editar">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => eliminar(c.id)} className="btn-outline !p-1.5 hover:text-red-400 hover:border-red-400/20" title="Eliminar">
                        <Trash2 size={14} />
                      </button>
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
