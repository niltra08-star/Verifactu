const API_BASE = '/api/v1';

function getToken(): string | null {
  try {
    const stored = localStorage.getItem('facturaia_user');
    if (stored) {
      const user = JSON.parse(stored);
      return user.token || null;
    }
  } catch { /* ignore */ }
  return null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    ...options,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Error ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface LineaFactura {
  concepto: string;
  cantidad: number;
  precioUnitario: number;
  ivaPorcentaje: number;
}

export interface FacturaRequest {
  clienteId: number;
  numeroFactura: string;
  serie?: string;
  fechaEmision: string;
  fechaOperacion?: string;
  fechaVencimiento: string;
  observaciones?: string;
  ivaPorcentaje: number;
  irpfPorcentaje: number;
  lineas: LineaFactura[];
}

export interface FacturaResponse {
  id: number;
  numeroFactura: string;
  serie: string;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: string;
  clienteId: number;
  clienteNombre: string;
  clienteNif: string;
  baseImponible: number;
  ivaPorcentaje: number;
  ivaImporte: number;
  irpfPorcentaje: number;
  irpfImporte: number;
  total: number;
  verifactuEnviada: boolean;
  huella: string;
  qrBase64: string;
  lineas: { orden: number; concepto: string; cantidad: number; precioUnitario: number; importe: number }[];
  createdAt: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  nif: string;
  email: string;
  direccion: string;
  ciudad: string;
  telefono: string;
}

export interface DashboardResponse {
  totalFacturas: number;
  totalClientes: number;
  totalFacturado: number;
  ivaPendiente: number;
  irpfPendiente: number;
  facturasEsteMes: number;
  facturadoEsteMes: number;
}

export const api = {
  dashboard: () => request<DashboardResponse>('/dashboard'),

  facturas: {
    list: () => request<FacturaResponse[]>('/facturas'),
    get: (id: number) => request<FacturaResponse>(`/facturas/${id}`),
    create: (data: FacturaRequest) =>
      request<FacturaResponse>('/facturas', { method: 'POST', body: JSON.stringify(data) }),
    anular: (id: number) =>
      request<FacturaResponse>(`/facturas/${id}/anular`, { method: 'POST' }),
  },

  clientes: {
    list: () => request<Cliente[]>('/clientes'),
    create: (data: Partial<Cliente>) =>
      request<Cliente>('/clientes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Cliente>) =>
      request<Cliente>(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) =>
      request<void>(`/clientes/${id}`, { method: 'DELETE' }),
  },
};
