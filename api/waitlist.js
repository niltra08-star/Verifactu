/**
 * FacturaIA Waitlist API (Vercel Edge Function)
 * Proxy hacia el backend Java Spring Boot.
 * Si el backend esta disponible, lo usa. Si no, guarda en Telegram directamente.
 */

export const config = { runtime: 'edge' };

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const BACKEND_URL = 'https://facturaia-backend.fly.dev';

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body;
  try { body = await request.json(); } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { email, source } = body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Email invalido' }, { status: 400 });
  }

  // 1. Intentar guardar en el backend Java (si esta desplegado)
  let backendOk = false;
  try {
    const beRes = await fetch(`${BACKEND_URL}/api/v1/public/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source })
    });
    backendOk = beRes.ok;
  } catch (e) {
    console.log('Backend no disponible, usando solo Telegram');
  }

  // 2. Enviar notificacion a Telegram siempre
  const dateStr = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
  const sourceLabel = source === 'heroForm' ? 'Hero principal' : source === 'ctaForm' ? 'CTA final' : source || 'Landing';
  const telegramMsg = [
    `📧 *Nuevo registro — FacturaIA*`,
    ``,
    `✉️ Email: \`${email}\``,
    `📍 Fuente: ${sourceLabel}`,
    `🕐 Fecha: ${dateStr}`,
    backendOk ? `\n✅ Guardado en base de datos` : '',
    source === 'heroForm' ? '\n⚠️ Lead del hero (alta intencion)' : '',
  ].filter(Boolean).join('\n');

  let telegramOk = false;
  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: telegramMsg, parse_mode: 'Markdown', disable_web_page_preview: true })
    });
    telegramOk = tgRes.ok;
  } catch (e) {
    console.error('Telegram error:', e.message);
  }

  return Response.json({
    success: true,
    message: 'Te has registrado correctamente. Te avisaremos cuando este listo.',
    telegram: telegramOk,
    backend: backendOk
  }, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store',
    }
  });
}
