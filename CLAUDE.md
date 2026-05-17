# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server at http://localhost:8080
npm run build      # Production build to dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint
npm run test       # Vitest (run once)
npm run test:watch # Vitest (watch mode)
```

## Environment setup

Copy `.env.example` to `.env` and fill in:
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` — from Supabase Dashboard → Settings → API
- `VITE_MP_PUBLIC_KEY` — MercadoPago public key (client-side)
- `MP_ACCESS_TOKEN` — MercadoPago access token (backend only, no `VITE_` prefix)

## Architecture

**Stack:** React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui + Supabase + MercadoPago

This is a Chilean e-commerce SPA for supplements, wearables, and wellness products.

### Provider tree

`AuthProvider` (Supabase auth session) → `QueryClientProvider` (TanStack Query) → `BrowserRouter` → `Navbar + Routes + Footer`

### Path aliases

`@/` maps to `src/`. All internal imports use this alias.

### Data flow

- **Products** live in Supabase table `products`. The `src/lib/dbProducts.ts` module is the single access layer; `src/lib/products.ts` re-exports `fetchAllProducts` / `fetchProduct` as the public API. Pages use `useProducts()` / `useProduct(id)` hooks from `src/hooks/useProducts.ts`, which cache for 60 seconds via TanStack Query.
- **Cart** is persisted in `localStorage` under key `cjhealth_cart`. All mutations dispatch a `cart-updated` window event so the Navbar badge updates reactively. Cart logic lives entirely in `src/lib/cart.ts`.
- **Auth** is handled by Supabase Auth (email/password + Google OAuth). `AuthContext` in `src/contexts/AuthContext.tsx` provides `{ user, session, loading, signIn, signUp, signInWithGoogle, signOut }`. Access it via `useAuth()` hook.
- **Orders** are stored in Supabase tables `orders` and `order_items`. RLS policies allow anonymous inserts (guest checkout) and restrict reads to the owning user or anon (filtered client-side by orderId).

### Payment flow

Two checkout paths exist:
1. **MercadoPago** (`/pago/mercadopago`) — calls `src/lib/mercadopago.ts → createPreference()`, which POSTs to `/api/mercadopago/create-preference` (backend endpoint not yet implemented). Falls back to a placeholder mock if the backend is unreachable. Result URLs: `/pago/exito`, `/pago/error`, `/pago/pendiente`.
2. **Transferencia bancaria** (`/pago/transferencia`) — user uploads a payment proof file which is stored in the Supabase Storage bucket `comprobantes`.

### Admin area

`/admin/productos` → `src/pages/admin/ProductosAdmin.tsx`. Access is gated by Supabase RLS: only the authenticated user with email `cjhealthsupply@gmail.com` can write to the `products` table or upload to `product-images` storage bucket.

### Database schema

Run `supabase_setup.sql` in Supabase SQL Editor to create:
- `products` — catalog (slug `id`, `category`, `section`, `active` for soft-delete, `details` as JSONB array)
- `orders` — customer orders (`user_id` nullable for guest checkout, `payment_method`: `'mercadopago'` | `'transferencia'`)
- `order_items` — line items per order

Product images are stored in the `product-images` Storage bucket (public). Payment proofs go in `comprobantes` (public).

### Routing

All routes are defined in `src/App.tsx`. The admin route (`/admin/productos`) has no client-side auth guard — access control is enforced entirely by Supabase RLS.

### Currency

All prices are stored as integers in CLP (Chilean pesos). Use `formatCLP()` from `src/lib/cart.ts` or `src/lib/products.ts` for display formatting.

### MercadoPago backend (pending)

The `/api/mercadopago/create-preference` endpoint must be implemented as either a Vercel Edge Function or a Supabase Edge Function. It receives cart items and customer data, calls the MercadoPago Preferences API with `MP_ACCESS_TOKEN`, and returns `{ id, init_point, sandbox_init_point }`. Without it the checkout falls back to a simulated redirect.
