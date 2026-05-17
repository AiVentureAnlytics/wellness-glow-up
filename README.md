# CJ Health Supply — Ecommerce

Tienda online de suplementos, wearables y wellness en Chile.

**Stack:** React 18 + Vite + TypeScript + Tailwind + shadcn/ui + Supabase + MercadoPago.

---

## 🚀 Setup local

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales reales

# 3. Levantar dev server
npm run dev
# → http://localhost:5173
```

### Scripts disponibles

| Comando             | Qué hace                                  |
|---------------------|-------------------------------------------|
| `npm run dev`       | Servidor de desarrollo                    |
| `npm run build`     | Build de producción a `dist/`             |
| `npm run preview`   | Preview del build local                   |
| `npm run lint`      | ESLint                                    |
| `npm run test`      | Vitest                                    |

---

## 🗄️ Setup Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Copia el **Project URL** y **anon key** desde Settings → API a tu `.env`
3. SQL Editor → pega y ejecuta `supabase_setup.sql`
4. Storage → crear bucket `comprobantes` (Public: ON)

### Auth: habilitar Google OAuth

1. Crea credenciales OAuth en [Google Cloud Console](https://console.cloud.google.com):
   - APIs & Services → Credentials → Create Credentials → OAuth client ID
   - Application type: **Web application**
   - Authorized redirect URI: `https://<TU-PROYECTO>.supabase.co/auth/v1/callback`
2. En Supabase: Authentication → Providers → Google → pega Client ID y Secret
3. Authentication → URL Configuration:
   - Site URL: tu dominio de producción
   - Redirect URLs: agrega `http://localhost:5173` y tu dominio

---

## 💳 Setup MercadoPago

1. Crea cuenta en [MercadoPago Developers](https://www.mercadopago.cl/developers)
2. Panel → Credenciales → copia **Public Key** y **Access Token**
3. Empieza con credenciales **TEST** y migra a **PROD** cuando salgas a producción
4. Pega en `.env`:
   ```
   VITE_MP_PUBLIC_KEY=TEST-...
   MP_ACCESS_TOKEN=TEST-...
   ```

### Backend endpoint (pendiente)

El cliente llama a `/api/mercadopago/create-preference`. Necesitas implementarlo:

- **Opción A — Vercel Edge Function** en `api/mercadopago/create-preference.ts`
- **Opción B — Supabase Edge Function** desplegada con `supabase functions deploy`

El endpoint debe:
1. Recibir `{ items, payer, external_reference, back_urls, notification_url }`
2. Llamar a `POST https://api.mercadopago.com/checkout/preferences` con `Authorization: Bearer $MP_ACCESS_TOKEN`
3. Retornar `{ id, init_point, sandbox_init_point }`

Sin este backend, la app usa un placeholder y simula la redirección.

### Webhook

MP enviará notificaciones a `/api/mercadopago/webhook`. Implementa este endpoint para actualizar el `status` de la orden en Supabase cuando recibas el callback.

---

## 🌐 Deploy a Vercel

```bash
# 1. Subir a GitHub
git init
git add .
git commit -m "Initial commit — CJ Health Supply ecommerce"
git remote add origin git@github.com:caetanojacksonm/cj-health-supply.git
git push -u origin main

# 2. Importar en Vercel
# vercel.com → Add New → Project → importar repo de GitHub
# Framework Preset: Vite
# Build Command: npm run build
# Output Directory: dist

# 3. Variables de entorno en Vercel
# Settings → Environment Variables:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_KEY
# - VITE_MP_PUBLIC_KEY
# - MP_ACCESS_TOKEN (sin VITE_, queda solo en el backend)
```

Vercel auto-deploya en cada push a `main`.

---

## 🗂️ Estructura

```
src/
├── components/       # UI (Navbar, Footer, ProductCard, shadcn/ui)
├── contexts/         # AuthContext (Supabase Auth)
├── hooks/            # useAuth, useCart, use-mobile
├── lib/              # supabase, cart, mercadopago, utils
├── pages/            # Index, Suplementos, Wearables, Wellness,
│                     # Carrito, Checkout, MercadoPagoCheckout,
│                     # Transferencia (alt), PagoResultado,
│                     # Login, Registro, MisOrdenes,
│                     # OrdenConfirmacion, ProductDetail, NotFound
└── assets/           # imágenes de productos + logos CJ
```

---

## ✅ Funcionalidades

- Catálogo con filtros por categoría (Proteínas / Creatinas / Vitaminas / Energía)
- Carrito persistido en localStorage
- Checkout en 3 pasos (datos → pago → confirmación)
- Pago con MercadoPago (Visa, Master, Débito, saldo MP)
- Alternativa: transferencia bancaria con upload de comprobante
- Login Email/Password + Google OAuth (Supabase Auth)
- Checkout sin cuenta (guest)
- "Mis órdenes" para usuarios autenticados
- Multipágina con react-router-dom
- Animaciones con framer-motion
- Responsive mobile-first

---

## 📞 Contacto

- Email: cjhealthsupply@gmail.com
- WhatsApp: +56 9 1234 5678
- Razón social: AVA S.A. — Santiago, Chile
