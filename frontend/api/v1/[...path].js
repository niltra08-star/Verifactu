const { pool } = require('../_utils/db');
const { calcularHuella, generarQRData, generarCadenaDatos } = require('../_utils/verifactu');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(pw, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(pw, stored) {
  const [salt, hash] = stored.split(':');
  const check = crypto.pbkdf2Sync(pw, salt, 10000, 64, 'sha512').toString('hex');
  return hash === check;
}

function signJWT(userId, email, nombre) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    sub: String(userId), email, nombre,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400,
  })).toString('base64url');
  const hmac = crypto.createHmac('sha256', JWT_SECRET);
  hmac.update(`${header}.${payload}`);
  const signature = hmac.digest('base64url');
  return `${header}.${payload}.${signature}`;
}

function verifyJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    if (payload.exp * 1000 < Date.now()) return null;
    const hmac = crypto.createHmac('sha256', JWT_SECRET);
    hmac.update(`${parts[0]}.${parts[1]}`);
    if (hmac.digest('base64url') !== parts[2]) return null;
    return { userId: parseInt(payload.sub), email: payload.email, nombre: payload.nombre };
  } catch { return null; }
}

function getUserId(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return verifyJWT(auth.slice(7))?.userId || null;
}

function json(res, data, status = 200) {
  res.status(status).json(data);
}

async function readBody(req) {
  return new Promise((resolve) => {
    if (req.body) return resolve(req.body);
    let data = '';
    req.on('data', c => data += c);
    req.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve({}); } });
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const body = req.method !== 'GET' ? await readBody(req) : {};
    const url = req.url || '';
    
    // Auth routes
    if (url.includes('/auth/register')) {
      const { nombre, email, password } = body;
      if (!nombre || !email || !password) return json(res, { error: 'Faltan campos' }, 400);
      if (password.length < 6) return json(res, { error: 'Contrasena muy corta' }, 400);
      const exists = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email.toLowerCase().trim()]);
      if (exists.rows.length > 0) return json(res, { error: 'Email ya registrado' }, 409);
      const pwHash = hashPassword(password);
      const r = await pool.query(
        'INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1,$2,$3) RETURNING id, nombre, email',
        [nombre, email.toLowerCase().trim(), pwHash]
      );
      const u = r.rows[0];
      return json(res, { token: signJWT(u.id, u.email, u.nombre), usuarioId: u.id, nombre: u.nombre, email: u.email, tipo: 'Bearer' }, 201);
    }

    if (url.includes('/auth/login')) {
      const { email, password } = body;
      if (!email || !password) return json(res, { error: 'Faltan campos' }, 400);
      const r = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email.toLowerCase().trim()]);
      if (r.rows.length === 0 || !verifyPassword(password, r.rows[0].password_hash))
        return json(res, { error: 'Credenciales incorrectas' }, 401);
      const u = r.rows[0];
      return json(res, { token: signJWT(u.id, u.email, u.nombre), usuarioId: u.id, nombre: u.nombre, email: u.email, tipo: 'Bearer' });
    }

    // Protected routes
    const userId = getUserId(req);
    if (!userId) return json(res, { error: 'Token no valido' }, 401);

    // Dashboard
    if (url.includes('/dashboard')) {
      const fr = await pool.query('SELECT COUNT(*) as c, COALESCE(SUM(total),0) as t FROM facturas WHERE usuario_id = $1 AND estado != $2', [userId, 'ANULADA']);
      const cr = await pool.query('SELECT COUNT(*) as c FROM clientes WHERE usuario_id = $1', [userId]);
      const ir = await pool.query('SELECT COALESCE(SUM(iva_importe),0) as iv, COALESCE(SUM(irpf_importe),0) as ir FROM facturas WHERE usuario_id = $1 AND estado IN ($2,$3)', [userId, 'EMITIDA', 'COBRADA']);
      return json(res, {
        totalFacturas: parseInt(fr.rows[0].c), totalClientes: parseInt(cr.rows[0].c),
        totalFacturado: parseFloat(fr.rows[0].t), ivaPendiente: parseFloat(ir.rows[0].iv),
        irpfPendiente: parseFloat(ir.rows[0].ir), facturasEsteMes: 0, facturadoEsteMes: 0,
      });
    }

    // Clientes
    if (url.includes('/clientes') && req.method === 'GET') {
      const r = await pool.query('SELECT * FROM clientes WHERE usuario_id = $1 ORDER BY nombre', [userId]);
      return json(res, r.rows);
    }
    if (url.includes('/clientes') && req.method === 'POST') {
      const { nombre, nif, email, direccion, ciudad, telefono } = body;
      if (!nombre) return json(res, { error: 'Nombre requerido' }, 400);
      const r = await pool.query(
        'INSERT INTO clientes (usuario_id, nombre, nif, email, direccion, ciudad, telefono) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
        [userId, nombre, nif, email, direccion, ciudad, telefono]
      );
      return json(res, r.rows[0], 201);
    }
    if (url.includes('/clientes') && req.method === 'PUT') {
      const id = parseInt(url.split('clientes/')[1]?.split('/')[0] || '0');
      const { nombre, nif, email, direccion, ciudad, telefono } = body;
      const r = await pool.query('UPDATE clientes SET nombre=$1,nif=$2,email=$3,direccion=$4,ciudad=$5,telefono=$6 WHERE id=$7 AND usuario_id=$8 RETURNING *', [nombre, nif, email, direccion, ciudad, telefono, id, userId]);
      if (r.rows.length === 0) return json(res, { error: 'No encontrado' }, 404);
      return json(res, r.rows[0]);
    }
    if (url.includes('/clientes') && req.method === 'DELETE') {
      const id = parseInt(url.split('clientes/')[1]?.split('/')[0] || '0');
      await pool.query('DELETE FROM clientes WHERE id=$1 AND usuario_id=$2', [id, userId]);
      return res.status(204).end();
    }

    // Facturas - List
    if (url === '/api/v1/facturas' && req.method === 'GET') {
      const r = await pool.query(
        `SELECT f.*, c.nombre as cliente_nombre, c.nif as cliente_nif FROM facturas f JOIN clientes c ON f.cliente_id = c.id
         WHERE f.usuario_id = $1 ORDER BY f.fecha_emision DESC`, [userId]
      );
      const facturas = [];
      for (const f of r.rows) {
        const lr = await pool.query('SELECT * FROM lineas_factura WHERE factura_id = $1 ORDER BY orden', [f.id]);
        facturas.push({
          id: f.id, numeroFactura: f.numero_factura, serie: f.serie,
          fechaEmision: f.fecha_emision, fechaVencimiento: f.fecha_vencimiento,
          estado: f.estado, clienteId: f.cliente_id, clienteNombre: f.cliente_nombre, clienteNif: f.cliente_nif,
          baseImponible: parseFloat(f.base_imponible), ivaPorcentaje: parseFloat(f.iva_porcentaje),
          ivaImporte: parseFloat(f.iva_importe), irpfPorcentaje: parseFloat(f.irpf_porcentaje),
          irpfImporte: parseFloat(f.irpf_importe), total: parseFloat(f.total),
          verifactuEnviada: f.verifactu_enviada, huella: f.huella, qrBase64: f.qr_base64,
          lineas: lr.rows.map(l => ({ orden: l.orden, concepto: l.concepto, cantidad: parseFloat(l.cantidad), precioUnitario: parseFloat(l.precio_unitario), importe: parseFloat(l.importe) })),
          createdAt: f.created_at,
        });
      }
      return json(res, facturas);
    }

    // Facturas - Create
    if (url === '/api/v1/facturas' && req.method === 'POST') {
      const { clienteId, numeroFactura, fechaEmision, fechaVencimiento, lineas, observaciones, ivaPorcentaje, irpfPorcentaje } = body;
      if (!clienteId || !numeroFactura || !fechaEmision || !lineas || lineas.length === 0)
        return json(res, { error: 'Faltan campos' }, 400);

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        let baseImponible = 0;
        const items = [];
        let idx = 1;
        for (const l of lineas) {
          const cant = parseFloat(l.cantidad) || 1, precio = parseFloat(l.precioUnitario) || 0;
          const imp = Math.round(cant * precio * 100) / 100;
          baseImponible += imp;
          items.push({ orden: idx++, concepto: l.concepto, cantidad: cant, precioUnitario: precio, importe: imp });
        }
        const ivaPct = parseFloat(ivaPorcentaje) || 21, irpfPct = parseFloat(irpfPorcentaje) || 15;
        const ivaImporte = Math.round(baseImponible * ivaPct) / 100;
        const total = Math.round((baseImponible + ivaImporte) * 100) / 100;
        const cadena = generarCadenaDatos('', numeroFactura, fechaEmision, total.toFixed(2));
        const huella = calcularHuella(cadena, null);
        const qrData = generarQRData('', numeroFactura, fechaEmision, total.toFixed(2), huella);

        const fr = await client.query(
          `INSERT INTO facturas (usuario_id, cliente_id, numero_factura, fecha_emision, fecha_vencimiento,
           base_imponible, iva_porcentaje, iva_importe, irpf_porcentaje, irpf_importe, total,
           observaciones, estado, verifactu_enviada, huella, qr_base64)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'EMITIDA',true,$13,$14) RETURNING *`,
          [userId, clienteId, numeroFactura, fechaEmision, fechaVencimiento || fechaEmision,
           baseImponible, ivaPct, ivaImporte, irpfPct, 0, total, observaciones, huella, qrData]
        );
        for (const item of items) {
          await client.query('INSERT INTO lineas_factura (factura_id, orden, concepto, cantidad, precio_unitario, importe) VALUES ($1,$2,$3,$4,$5,$6)',
            [fr.rows[0].id, item.orden, item.concepto, item.cantidad, item.precioUnitario, item.importe]);
        }
        await client.query('COMMIT');

        const cr = await pool.query('SELECT nombre, nif FROM clientes WHERE id = $1', [clienteId]);
        return json(res, {
          id: fr.rows[0].id, numeroFactura, fechaEmision, fechaVencimiento: fechaVencimiento || fechaEmision,
          estado: 'EMITIDA', clienteId, clienteNombre: cr.rows[0].nombre, clienteNif: cr.rows[0].nif || '',
          baseImponible, ivaPorcentaje: ivaPct, ivaImporte, irpfPorcentaje: irpfPct, irpfImporte: 0,
          total, verifactuEnviada: true, huella, qrBase64: qrData, lineas: items,
        }, 201);
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally { client.release(); }
    }

    // Facturas - Anular
    if (url.includes('/facturas/') && url.includes('/anular')) {
      const id = parseInt(url.split('facturas/')[1]?.split('/')[0] || '0');
      const r = await pool.query('UPDATE facturas SET estado=$1 WHERE id=$2 AND usuario_id=$3 RETURNING *', ['ANULADA', id, userId]);
      if (r.rows.length === 0) return json(res, { error: 'No encontrada' }, 404);
      return json(res, { success: true });
    }

    return json(res, { error: 'Not found' }, 404);
  } catch (err) {
    console.error('API Error:', err);
    return json(res, { error: 'Error interno' }, 500);
  }
};
