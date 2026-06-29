<div align="center">
  <h1>🚀 Verifactu API</h1>
  <h3>The Developer-First Electronic Invoicing SaaS for Spain</h3>
  <p><i>A "Stripe-like" integration experience for the new AEAT (RD 1007/2023) billing regulations.</i></p>
</div>

---

## 📌 Overview
**Verifactu API** is a comprehensive, developer-first REST API SaaS designed to seamlessly handle the complex Spanish electronic invoicing regulations (Verifactu, AEAT, RD 1007/2023). Built with an absolute focus on developer experience, it abstracts cryptographic signing, QR generation, and chained hashing into clean, predictable endpoints. 

It features a freemium model (100 free invoices/month) with scalable pro subscriptions designed for high-volume enterprise integrations.

---

## 🏗️ Architecture & Infrastructure
The system is built on a decoupled, highly scalable architecture ensuring high availability and seamless data flow.

*   **Core Backend (Java/Spring Boot):** The heavy lifting—including the Verifactu chained hash engine, ZXing QR generation, and Bouncy Castle cryptography—is handled by a robust Java 21 Spring Boot API.
*   **Dashboard & Auth (Next.js SPA):** A React 18 / Next.js 16 application managing user authentication (JWT + bcryptjs), subscription tiers, and API key provisioning.
*   **Public Front & SEO (Vite/React):** A lightning-fast, statically generated frontend optimized for programmatic SEO (50+ local landing pages) and technical documentation.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend API** | Java 21, Spring Boot 3.4, Maven, Hibernate Validator |
| **Frontend (SPA & Web)** | React 19, Next.js 16, Vite, Tailwind CSS, TypeScript, Zod |
| **Database & ORM** | PostgreSQL (Neon), Prisma ORM |
| **Cache & Security** | Upstash Redis (Rate Limiting), JWT, bcryptjs |
| **Cryptography & Core** | Bouncy Castle (Hash/Firma), ZXing (QR) |
| **Deployments** | Vercel (Frontend & Dashboard), Railway/Render (Backend) |
| **Payments** | Stripe |

---

## 🛡️ Security & Anti-Fraud System
To ensure platform stability and protect the freemium tier, the API implements a dynamic rate-limiting engine via Upstash Redis:
*   **IP Monitoring:** Maximum 3 registrations per IP/day.
*   **Dynamic Throttling:** 5+ accounts on a single IP restricts traffic to 10 requests/minute. Limits auto-reset upon normalized behavior.

---

## 🔌 Core API Endpoints
Comprehensive documentation generated via SpringDoc OpenAPI.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | User onboarding & JWT generation |
| `POST` | `/api/auth/login` | Secure authentication |
| `GET` | `/api/v1/health` | Service status and latency |
| `GET/POST` | `/api/v1/invoices` | Invoice creation & chained hashing |
| `GET/POST` | `/api/v1/invoices/[id]` | Invoice retrieval & QR extraction |
| `GET/POST` | `/api/v1/keys` | API Key provisioning & rotation |

---

## 📈 Scalability & Business Model
The platform is built to scale alongside our clients' needs, integrating programmatic SEO and a tiered monetization strategy:
*   **Hacker:** Free tier (100 invoices/mo) for indie developers.
*   **Indie (€9/mo):** 1,500 invoices/mo.
*   **Studio (€49/mo):** 10,000 invoices/mo.
*   **Scale (€199/mo):** 100,000 invoices/mo.

**Current Roadmap Focus:** Unlocking Pro subscription tiers via Stripe, integrating ad networks for the free tier, and expanding the programmatic SEO footprint (over 50+ local business and competitor comparison pages already deployed).
