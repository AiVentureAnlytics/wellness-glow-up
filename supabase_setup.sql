-- ============================================================
-- CJ HEALTH SUPPLY — Setup Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ============================================================
-- TABLAS
-- ============================================================

-- Tabla de órdenes
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  status text not null default 'pendiente_pago',
  total integer not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  customer_address text,
  payment_proof_url text,
  payment_method text default 'mercadopago', -- 'mercadopago' o 'transferencia'
  payment_reference text,                    -- ID de pago de MP
  user_id uuid references auth.users(id) on delete set null, -- null si guest checkout
  notes text
);

-- Tabla de items por orden
create table if not exists order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade,
  product_id text,
  product_name text not null,
  price integer not null,
  qty integer not null,
  img_url text
);

-- Índices útiles
create index if not exists idx_orders_user_id on orders(user_id);
create index if not exists idx_orders_email on orders(customer_email);
create index if not exists idx_orders_created_at on orders(created_at desc);
create index if not exists idx_order_items_order_id on order_items(order_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table orders enable row level security;
alter table order_items enable row level security;

-- Limpiar policies previas para evitar duplicados
drop policy if exists "Insertar orden" on orders;
drop policy if exists "Insertar items" on order_items;
drop policy if exists "Ver orden propia" on orders;
drop policy if exists "Ver items propios" on order_items;
drop policy if exists "Actualizar orden propia" on orders;
drop policy if exists "orders_insert_anyone" on orders;
drop policy if exists "order_items_insert_anyone" on order_items;
drop policy if exists "orders_select_own" on orders;
drop policy if exists "order_items_select_own" on order_items;
drop policy if exists "orders_update_status" on orders;
drop policy if exists "orders_cancel_own" on orders;

-- Cualquiera puede crear una orden (guest checkout)
create policy "orders_insert_anyone"
  on orders for insert
  with check (true);

create policy "order_items_insert_anyone"
  on order_items for insert
  with check (true);

-- Solo el usuario dueño puede ver sus órdenes (por user_id o email del JWT)
create policy "orders_select_own"
  on orders for select
  using (
    user_id = auth.uid()
    or customer_email = (auth.jwt() ->> 'email')
  );

create policy "order_items_select_own"
  on order_items for select
  using (
    order_id in (
      select id from orders
      where user_id = auth.uid()
         or customer_email = (auth.jwt() ->> 'email')
    )
  );

-- Solo el dueño puede cancelar su propia orden; el webhook usa service_role (bypasea RLS)
create policy "orders_cancel_own"
  on orders for update
  using (user_id = auth.uid() or customer_email = (auth.jwt() ->> 'email'))
  with check (status = 'cancelado');

-- ============================================================
-- STORAGE: bucket para comprobantes de transferencia
-- ============================================================
-- Ir a: Storage → New bucket → nombre: "comprobantes" → Public: ON

-- ============================================================
-- AUTH: configurar providers
-- ============================================================
-- 1. Authentication → Providers → Email: habilitar (default ON)
-- 2. Authentication → Providers → Google:
--    - Crear OAuth client en https://console.cloud.google.com
--    - Authorized redirect URI: https://<TU-PROJECT>.supabase.co/auth/v1/callback
--    - Pegar Client ID y Secret en Supabase dashboard
-- 3. Authentication → URL Configuration:
--    - Site URL: https://tu-dominio.cl (o http://localhost:5173 en dev)
--    - Redirect URLs: agregar el dominio de producción y dev

-- ============================================================
-- TABLA: products (catálogo administrable)
-- ============================================================
create table if not exists products (
  id text primary key,                                       -- slug tipo "ostrovit-ashwa-200"
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  name text not null,
  description text,                                          -- bajada corta
  details jsonb default '[]'::jsonb,                         -- lista de bullets de features
  price integer not null,                                    -- en CLP enteros
  img text not null,                                         -- URL pública (Storage o externa)
  category text not null check (category in ('proteinas','creatinas','vitaminas','energia','wellness','wearables')),
  section text not null check (section in ('Suplementos','Wellness','Wearables')),
  badge text,                                                -- "Top venta", "Nuevo", etc.
  active boolean default true,                               -- soft-delete
  stock integer default 999                                  -- para futuro control de inventario
);

create index if not exists idx_products_section on products(section);
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_active on products(active);

-- trigger para mantener updated_at al día
create or replace function set_products_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at
  before update on products
  for each row execute function set_products_updated_at();

-- RLS: lectura pública, escritura solo para usuarios con email admin
alter table products enable row level security;

drop policy if exists "products_select_public" on products;
drop policy if exists "products_admin_write" on products;
drop policy if exists "products_admin_update" on products;
drop policy if exists "products_admin_delete" on products;

create policy "products_select_public"
  on products for select
  using (active = true or auth.jwt() ->> 'email' = 'cjhealthsupply@gmail.com');

create policy "products_admin_write"
  on products for insert
  with check (auth.jwt() ->> 'email' = 'cjhealthsupply@gmail.com');

create policy "products_admin_update"
  on products for update
  using (auth.jwt() ->> 'email' = 'cjhealthsupply@gmail.com');

create policy "products_admin_delete"
  on products for delete
  using (auth.jwt() ->> 'email' = 'cjhealthsupply@gmail.com');

-- ============================================================
-- STORAGE: bucket para imágenes de productos
-- ============================================================
-- Ir a: Storage → New bucket → nombre: "product-images" → Public: ON

-- Policies para el bucket product-images (correr DESPUÉS de crear el bucket en UI):
-- Storage → product-images → Policies → New policy:
--   Nombre: "Public read"
--   Allowed operation: SELECT
--   Target roles: anon, authenticated
--   USING expression: true

--   Nombre: "Admin upload"
--   Allowed operation: INSERT
--   Target roles: authenticated
--   WITH CHECK: (auth.jwt() ->> 'email') = 'cjhealthsupply@gmail.com'

--   Nombre: "Admin delete"
--   Allowed operation: DELETE
--   Target roles: authenticated
--   USING: (auth.jwt() ->> 'email') = 'cjhealthsupply@gmail.com'

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
-- select * from orders limit 5;
-- select * from order_items limit 10;
-- select * from products limit 10;

-- ============================================================
-- MIGRACIÓN: stock tracking en órdenes
-- Correr en SQL Editor DESPUÉS del setup inicial
-- ============================================================

-- 1. Columna para evitar double-decrement de stock
alter table orders add column if not exists stocks_decremented boolean default false;

-- 2. Función para decrementar stock de forma atómica e idempotente.
--    SECURITY DEFINER: corre con permisos del owner (postgres), saltando RLS.
--    Solo el service_role (webhook vía SUPABASE_SERVICE_ROLE_KEY) puede llamarla.
create or replace function decrement_order_stocks(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item record;
begin
  -- Guard: solo decrementar si la orden está verificada (pago confirmado)
  if not exists (
    select 1 from orders where id = p_order_id and status = 'verificado'
  ) then
    raise exception 'Order % is not verified — stock decrement rejected', p_order_id;
  end if;

  -- Idempotencia: si ya se decrementó, no hacer nada
  if exists (
    select 1 from orders where id = p_order_id and stocks_decremented = true
  ) then
    return;
  end if;

  -- Decrementar stock por cada ítem de la orden
  for v_item in
    select product_id, qty from order_items where order_id = p_order_id
  loop
    update products
      set stock = greatest(0, stock - v_item.qty)
      where id = v_item.product_id;
  end loop;

  -- Marcar la orden como "stocks ya decrementados"
  update orders set stocks_decremented = true where id = p_order_id;
end;
$$;

-- Revocar acceso anónimo y autenticado — solo service_role (webhook) puede ejecutar
revoke execute on function decrement_order_stocks(uuid) from anon;
revoke execute on function decrement_order_stocks(uuid) from authenticated;

-- ============================================================
-- MIGRACIÓN: RUT del comprador
-- Correr en SQL Editor si la tabla ya existe
-- ============================================================
alter table orders add column if not exists customer_rut text;
