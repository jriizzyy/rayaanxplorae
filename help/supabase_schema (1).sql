-- Supabase schema for RayaanXplorAE (Postgres)

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- USERS
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  auth_id text unique,
  email text unique not null,
  role text not null default 'customer',
  created_at timestamptz not null default now()
);

-- PRODUCTS
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'USD',
  thumbnail_url text,
  banner_url text,
  category text,
  tags text[] not null default '{}',
  is_published boolean not null default false,
  digital_file_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_is_published_idx on public.products(is_published);
create index if not exists products_category_idx on public.products(category);

-- CARTS
create table if not exists public.carts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete set null,
  session_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);
create table if not exists public.cart_items (
  id uuid primary key default uuid_generate_v4(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id),
  qty integer not null check (qty > 0),
  unique (cart_id, product_id)
);
create index if not exists cart_items_cart_idx on public.cart_items(cart_id);

-- ORDERS
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete set null,
  email text not null,
  amount_total_cents integer not null,
  currency text not null default 'USD',
  stripe_session_id text unique not null,
  payment_status text not null,
  created_at timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders(user_id);

-- ORDER ITEMS
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  title text not null,
  price_cents integer not null,
  qty integer not null check (qty > 0)
);

-- DOWNLOAD TOKENS
create table if not exists public.downloads (
  token text primary key default encode(gen_random_bytes(24), 'hex'),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  email text not null,
  expires_at timestamptz not null,
  used_at timestamptz
);
create index if not exists downloads_order_idx on public.downloads(order_id);
create index if not exists downloads_product_idx on public.downloads(product_id);

-- RLS
alter table public.products enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.downloads enable row level security;

drop policy if exists "read published products" on public.products;
create policy "read published products"
on public.products
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "deny all carts" on public.carts;
create policy "deny all carts"
on public.carts
for all
to public
using (false)
with check (false);

drop policy if exists "deny all cart_items" on public.cart_items;
create policy "deny all cart_items"
on public.cart_items
for all
to public
using (false)
with check (false);

drop policy if exists "deny all orders" on public.orders;
create policy "deny all orders"
on public.orders
for all
to public
using (false)
with check (false);

drop policy if exists "deny all order_items" on public.order_items;
create policy "deny all order_items"
on public.order_items
for all
to public
using (false)
with check (false);

drop policy if exists "deny all downloads" on public.downloads;
create policy "deny all downloads"
on public.downloads
for all
to public
using (false)
with check (false);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_carts_updated_at on public.carts;
create trigger set_carts_updated_at before update on public.carts
for each row execute function public.set_updated_at();
