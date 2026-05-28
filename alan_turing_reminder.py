import os
import sys
import requests
from datetime import date, timedelta

BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID")

if not BOT_TOKEN or not CHAT_ID:
    print("ERROR: Variables TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID no configuradas")
    sys.exit(1)

BASE_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"
FECHA_APERTURA = date(2026, 6, 15)
FECHA_CIERRE = date(2026, 6, 30)
REMINDER_DAYS = [7, 3]

MASTERS = [
    ("IA y Big Data", "Manana", "Presencial + Dual", "https://fpalanturing.es/ce-iabd/"),
    ("Ciberseguridad en Entornos TI", "Manana / A distancia", "Presencial + Virtual + Dual", "https://fpalanturing.es/ce-ceti/"),
    ("Videojuegos y Realidad Virtual", "Manana", "Presencial + Dual", "https://fpalanturing.es/ce-vvr/"),
    ("Desarrollo Apps en Python", "Tarde", "Presencial", "https://fpalanturing.es/ce-en-desarrollo-de-aplicaciones-en-lenguaje-python/"),
]

MESES = {
    1: "enero", 2: "febrero", 3: "marzo", 4: "abril",
    5: "mayo", 6: "junio", 7: "julio", 8: "agosto",
    9: "septiembre", 10: "octubre", 11: "noviembre", 12: "diciembre",
}


def send_telegram(text):
    r = requests.post(f"{BASE_URL}/sendMessage", json={
        "chat_id": CHAT_ID,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }, timeout=15)
    return r.json()


def build_reminder(event_date, label, verb, days_before):
    masters_text = ""
    for i, (nombre, turno, modalidad, url) in enumerate(MASTERS, 1):
        masters_text += f"<b>{i}. {nombre}</b>\n   {turno} | {modalidad}\n   {url}\n\n"

    fecha_str = f"{event_date.day} de {MESES[event_date.month]} de {event_date.year}"

    return (
        f"<b>RECORDATORIO: {label}</b>\n\n"
        f"Faltan <b>{days_before} dias</b> para que se {verb} "
        f"las solicitudes de los Cursos de Especializacion del <b>CPIFP Alan Turing</b>.\n\n"
        f"Fecha del evento: <b>{fecha_str}</b>\n\n"
        f"{masters_text}"
        f"Inscribete aqui: https://fpalanturing.es/escolarizacion/\n"
        f"Telefono: 951 040 449"
    )


hoy = date.today()
print(f"Verificando recordatorios para {hoy}...")

if hoy > FECHA_CIERRE:
    if hoy == FECHA_CIERRE + timedelta(days=1):
        send_telegram(
            "<b>CPIFP Alan Turing - Recordatorios finalizados</b>\n\n"
            "El plazo de solicitudes ya ha cerrado (30 de junio de 2026).\n\n"
            "Este bot ya no enviara mas recordatorios. Cuando puedas, borra los secrets de GitHub:\n"
            "<code>gh secret remove TELEGRAM_BOT_TOKEN --repo niltra08-star/Verifactu</code>\n"
            "<code>gh secret remove TELEGRAM_CHAT_ID --repo niltra08-star/Verifactu</code>"
        )
    print("Plazo de solicitudes finalizado. Este workflow ya no es necesario.")
    sys.exit(0)

enviados = 0

eventos = [
    (FECHA_APERTURA, "ABRE el plazo de solicitudes", "abran"),
    (FECHA_CIERRE, "CIERRA el plazo de solicitudes", "cierren"),
]

for event_date, label, verb in eventos:
    for days_before in REMINDER_DAYS:
        if hoy == event_date - timedelta(days=days_before):
            msg = build_reminder(event_date, label, verb, days_before)
            result = send_telegram(msg)
            if result.get("ok"):
                print(f"  Enviado: {label} - {days_before} dias antes")
                enviados += 1
            else:
                print(f"  ERROR: {result}")

if enviados == 0:
    print("No hay recordatorios pendientes para hoy.")
else:
    print(f"Total recordatorios enviados: {enviados}")
