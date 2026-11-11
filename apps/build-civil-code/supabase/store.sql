-- Build Civil Store: categories, products, orders and quote requests.
-- Run this once in the Supabase SQL editor (the project is shared by the
-- website and admin apps). Safe to re-run: every statement is idempotent.

create table if not exists public.store_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  image text not null default '',
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.store_products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category_id uuid references public.store_categories(id) on delete set null,
  sku text not null default '',
  brand text not null default '',
  short_description text not null default '',
  description text not null default '',
  price numeric(12, 2) not null default 0,
  compare_at_price numeric(12, 2),
  unit text not null default 'piece',
  min_order_qty integer not null default 1,
  stock_status text not null default 'in_stock',
  image text not null default '',
  gallery jsonb not null default '[]'::jsonb,
  specs jsonb not null default '[]'::jsonb,
  seo_title text not null default '',
  seo_description text not null default '',
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint store_products_stock_check check (stock_status in ('in_stock', 'made_to_order', 'out_of_stock')),
  constraint store_products_price_check check (price >= 0),
  constraint store_products_moq_check check (min_order_qty >= 1)
);

create index if not exists store_products_category_idx on public.store_products (category_id);

create table if not exists public.store_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  name text not null,
  email text not null,
  phone text not null,
  address text not null,
  city text not null,
  state text not null default '',
  pincode text not null,
  notes text not null default '',
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12, 2) not null default 0,
  shipping numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  payment_method text not null default 'cod',
  status text not null default 'new',
  admin_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint store_orders_status_check check (status in ('new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  constraint store_orders_payment_check check (payment_method in ('cod', 'bank_transfer'))
);

create table if not exists public.store_quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  message text not null default '',
  items jsonb not null default '[]'::jsonb,
  estimated_total numeric(12, 2) not null default 0,
  source text not null default 'store',
  status text not null default 'new',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint store_quote_requests_status_check check (status in ('new', 'read', 'replied', 'closed'))
);

-- All access goes through the service-role key used by the Next.js servers.
alter table public.store_categories enable row level security;
alter table public.store_products enable row level security;
alter table public.store_orders enable row level security;
alter table public.store_quote_requests enable row level security;

grant select, insert, update, delete on public.store_categories to service_role;
grant select, insert, update, delete on public.store_products to service_role;
grant select, insert, update, delete on public.store_orders to service_role;
grant select, insert, update, delete on public.store_quote_requests to service_role;
