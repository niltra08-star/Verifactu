# 🎯 PLAN DE VALIDACIÓN — FacturaIA

## FASE 0: LO QUE YA ESTÁ HECHO

- ✅ Landing page de waitlist: `C:\Users\navas\Desktop\.opencode\facturaia\index.html`
- ✅ Investigación de mercado completada (nichos, competencia, legal, fiscal)
- ✅ Stack tecnológico definido (Cloudflare + Supabase + LemonSqueezy, coste 0€)

---

## FASE 1: VALIDACIÓN PRE-MVP (TÚ — ESTA SEMANA)

### 📋 Tarea 1: Hablar con 15 autónomos cara a cara

**Dónde encontrarlos en Málaga:**
| Lugar | Dirección | Por qué |
|-------|-----------|---------|
| La Térmica | Av. de los Guindos, 48 | Coworking lleno de autónomos y freelancers |
| Andalucía Open Future | C/ Severo Ochoa, 8 (PTA) | Aceleradora, muchos emprendedores |
| Palo Digital | Av. de Sor Teresa Prat, 15 | Centro de innovación, startups |
| Campus 42 Málaga | C/ Severo Ochoa (PTA) | Programadores freelance |
| Café de barrio cualquiera | — | Muchos autónomos trabajan desde cafeterías |

**Guión de entrevista (5-10 minutos):**
```
1. "Hola, estoy creando una app de facturación y necesito entender 
   cómo lo hacéis los autónomos. ¿Me regalas 5 minutos?"

2. "¿Cómo llevas ahora la facturación? 
   (¿App? ¿Papel? ¿Gestoría? ¿Excel?)"

3. "¿Cuánto tiempo le dedicas al mes a facturas, tickets, impuestos?"

4. "¿Qué es lo que más ODIAS de este proceso?"

5. "¿Sabes que en 2026 será obligatoria la factura electrónica Verifactu?
   ¿Has oído hablar de eso?"

6. "¿Cuánto pagas de gestoría al mes? ¿Te gustaría pagar menos?"

7. "Si existiera una app donde haces una foto al ticket y te calcula 
   los impuestos solo, ¿la usarías? ¿Cuánto pagarías?"

8. "¿Tu gestor te recomendaría usar una app así?"
```

**Registra las respuestas en este formato:**
```
Autónomo #1 - [Nombre/Sector] - Fecha:
- Herramienta actual: [app/gestoría/excel]
- Tiempo facturación/mes: [X horas]
- Mayor dolor: [lo que más odia]
- Conoce Verifactu: [Sí/No]
- Paga gestoría: [€X/mes]
- Usaría la app: [Sí/No/Quizás]
- Pagaría: [€X/mes]
- Cita textual impactante: "[...]"
```

**Objetivo:** Hablar con **15 autónomos**. Si después de 15 entrevistas nadie dice "la necesito YA", pivota la idea.

---

### 📋 Tarea 2: Encuesta en grupos de Facebook

**Grupos donde publicar:**

| Grupo | Miembros | Link |
|-------|----------|------|
| Autónomos España | ~50K | facebook.com/groups/autonomos.espana |
| Autónomos y Emprendedores | ~30K | facebook.com/groups/autonomosyemprendedores |
| Asesoria para Autónomos | ~20K | facebook.com/groups/asesoriaautonomos |
| Freelancers España | ~15K | Buscar en Facebook |
| Emprendedores Málaga | ~5K | Buscar en Facebook |

**Texto de la encuesta:**
```
🚀 ¡Hola a todos! Estoy desarrollando una app GRATUITA de facturación 
con inteligencia artificial para autónomos y necesito vuestra ayuda 
para que sea útil de verdad.

¿Me ayudáis respondiendo estas 3 preguntas? Son 30 segundos:

1️⃣ ¿Qué herramienta usas para facturar? (app, Excel, gestoría...)

2️⃣ ¿Qué es lo que MÁS ODIAS de facturar/tus impuestos?

3️⃣ ¿Pagarías 15€/mes por una app que te hace TODO automático 
   (foto al ticket → categorizado → factura electrónica → impuestos 
   calculados)?

Responded aquí abajo o por privado. ¡Gracias! 🙏

(Por cierto, si alguien quiere probar la beta gratis, que me lo diga)
```

---

### 📋 Tarea 3: Landing page de waitlist

1. Abre `C:\Users\navas\Desktop\.opencode\facturaia\index.html` en el navegador
2. Revísala, dime si quieres cambios
3. Cuando esté lista, la desplegamos gratis en Cloudflare Pages o Vercel
4. Compra un dominio: `facturaia.com` o `facturaia.app` (~9€/año en Cloudflare)
5. Conecta el formulario a un servicio de email:
   - Opción A: **LemonSqueezy** (ya lo necesitarás para pagos, tiene waitlist gratis)
   - Opción B: **Google Forms** → Google Sheets (lo más simple)
   - Opción C: **ConvertKit** (gratis hasta 1.000 suscriptores)

**Objetivo:** 50 emails en 2 semanas.

---

## FASE 2: MVP (YO — 6-8 SEMANAS SI DECIDES SEGUIR)

Si la validación es positiva (>50% de entrevistados dicen SÍ), construyo el MVP:

### Semana 1-2: Core
- Auth (login Google/email con Supabase)
- Subir foto ticket → Gemini OCR → extraer datos
- Dashboard resumen (ingresos/gastos mes)

### Semana 3-4: Facturación
- Crear factura + generar PDF FacturaE
- Lista de facturas emitidas/recibidas

### Semana 5-6: Impuestos
- Cálculo IVA trimestral
- Estimación IRPF
- Pre-visualización modelo 303

### Semana 7-8: Pagos + Launch
- Planes Free/Pro/Premium (LemonSqueezy)
- Onboarding + landing definitiva
- Lanzamiento en Product Hunt + grupos autónomos

---

## FASE 3: ESCALA (MESES 3-12)

| Mes | Meta | Canales |
|-----|------|---------|
| 1-2 | 0 clientes (beta gratis) | Grupos Facebook + boca a boca |
| 3 | 20 clientes de pago | Early adopters + alt/ tráfico |
| 6 | 100 clientes | SEO + partnerships gestorías |
| 9 | 250 clientes | App móvil + Verifactu compliance |
| 12 | 500 clientes | Ads + recomendaciones |

---

## 📊 MÉTRICAS DE ÉXITO (GO / NO-GO)

| Métrica | GO | NO-GO |
|---------|-----|-------|
| Entrevistas hechas | ≥15 | <10 |
| % que pagarían | ≥40% | <20% |
| Emails waitlist | ≥50 en 2 sem | <20 en 2 sem |
| Dolor real detectado | "Odio esto, tardo 5h/mes" | "No me molesta mucho" |
| Competencia real | Holded/Debitoor con quejas | Todos felices con su app actual |

---

## ⚡ PRÓXIMOS PASOS INMEDIATOS (HOY)

1. [ ] **TÚ**: Elige 3 coworkings de Málaga y ve mañana
2. [ ] **TÚ**: Publica la encuesta en 3 grupos de Facebook
3. [ ] **TÚ**: Revisa la landing page en `facturaia\index.html`, dime cambios
4. [ ] **YO**: Convierto el SVG de alt/ a PNG para la imagen OG
5. [ ] **YO**: Te ayudo a desplegar la landing de FacturaIA
