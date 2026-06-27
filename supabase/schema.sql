create extension if not exists pgcrypto;
create schema if not exists extensions;
create extension if not exists citext with schema extensions;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  card_label text not null default '',
  location text not null default '',
  image text not null default '',
  description text not null default '',
  year text not null default '',
  height_class text not null default '',
  overview text not null default '',
  hero_title text not null default '',
  hero_copy text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  seo_image text not null default '',
  highlights jsonb not null default '[]'::jsonb,
  stats jsonb not null default '[]'::jsonb,
  process jsonb not null default '[]'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  icon_name text not null default 'home',
  title text not null,
  description text not null default '',
  kicker text not null default '',
  image text not null default '',
  accent text not null default 'from-[#E87F24]/30 via-[#FFC81E]/14 to-transparent',
  hero_title text not null default '',
  hero_copy text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  seo_image text not null default '',
  intro text not null default '',
  bullets jsonb not null default '[]'::jsonb,
  details jsonb not null default '[]'::jsonb,
  stats jsonb not null default '[]'::jsonb,
  process jsonb not null default '[]'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_revisions (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id text not null,
  action text not null default 'update',
  snapshot jsonb not null default '{}'::jsonb,
  created_by text not null default '',
  created_at timestamptz not null default now(),
  constraint cms_revisions_action_check check (action in ('create', 'update', 'delete', 'publish'))
);

alter table public.cms_revisions enable row level security;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  project_type text,
  details text,
  status text not null default 'new',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_messages_status_check check (status in ('new', 'read', 'replied', 'closed'))
);

create table if not exists public.service_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  service text not null,
  other_service text not null default '',
  status text not null default 'new',
  source text not null default 'home_hero',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_enquiries_status_check check (status in ('new', 'read', 'replied', 'closed')),
  constraint service_enquiries_service_check check (length(trim(service)) > 0),
  constraint service_enquiries_other_required_check check (service <> 'Other' or length(trim(other_service)) > 0)
);

alter table public.service_enquiries enable row level security;

create table if not exists public.construction_packages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  badge text not null default '',
  name text not null,
  price text not null default '',
  price_unit text not null default '/sqft',
  tagline text not null default '',
  package_name text not null default '',
  icon_name text not null default 'home',
  features jsonb not null default '[]'::jsonb,
  projects text not null default '',
  satisfaction text not null default '',
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.construction_packages enable row level security;

create table if not exists public.package_materials (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.construction_packages(id) on delete cascade,
  label text not null,
  value text not null,
  icon_name text not null default 'package',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.package_materials enable row level security;

create table if not exists public.package_quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  plan_name text not null,
  package_id uuid references public.construction_packages(id) on delete set null,
  start_timeline text not null default '',
  status text not null default 'new',
  notes text not null default '',
  source text not null default 'home_plan_quote',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint package_quote_requests_status_check check (status in ('new', 'read', 'replied', 'closed'))
);

alter table public.package_quote_requests enable row level security;

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_url text not null,
  file_type text not null default '',
  provider text not null default 'supabase',
  storage_key text not null default '',
  mime_type text not null default '',
  file_size bigint not null default 0,
  width integer,
  height integer,
  alt_text text not null default '',
  folder text not null default 'general',
  uploaded_by text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.media_assets enable row level security;

create table if not exists public.seo_drafts (
  id uuid primary key default gen_random_uuid(),
  target_type text not null,
  target_id text not null,
  target_slug text not null default '',
  primary_keyword text not null default '',
  secondary_keywords text[] not null default '{}'::text[],
  target_location text not null default '',
  brand_tone text not null default 'premium construction company',
  draft_title text not null default '',
  draft_description text not null default '',
  draft_keywords text[] not null default '{}'::text[],
  status text not null default 'draft',
  created_by text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint seo_drafts_status_check check (status in ('draft', 'applied', 'archived')),
  constraint seo_drafts_target_type_check check (target_type in ('page', 'service', 'project'))
);

alter table public.seo_drafts enable row level security;

grant select, insert, update, delete on public.seo_drafts to authenticated;
grant select, insert, update, delete on public.seo_drafts to service_role;

create table if not exists public.policy_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text not null default '',
  content text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  published boolean not null default true,
  show_in_header boolean not null default false,
  show_in_footer boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint policy_pages_slug_check check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint policy_pages_title_check check (length(trim(title)) > 0)
);

alter table public.policy_pages enable row level security;
grant select, insert, update, delete on table public.policy_pages to service_role;

create table if not exists public.site_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null default '',
  hero_label text not null default '',
  hero_title text not null default '',
  hero_copy text not null default '',
  hero_image text not null default '',
  content jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email extensions.citext unique not null,
  name text not null default '',
  role text not null default 'editor',
  status text not null default 'active',
  password_hash text not null,
  password_salt text not null,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_users_role_check check (role in ('super_admin', 'admin', 'editor', 'content_manager', 'leads_manager', 'media_manager', 'project_manager')),
  constraint admin_users_status_check check (status in ('active', 'disabled'))
);

alter table public.admin_users enable row level security;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql
set search_path = public, pg_temp;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists set_messages_updated_at on public.contact_messages;
create trigger set_messages_updated_at
before update on public.contact_messages
for each row execute function public.set_updated_at();

drop trigger if exists set_service_enquiries_updated_at on public.service_enquiries;
create trigger set_service_enquiries_updated_at
before update on public.service_enquiries
for each row execute function public.set_updated_at();

drop trigger if exists set_site_pages_updated_at on public.site_pages;
create trigger set_site_pages_updated_at
before update on public.site_pages
for each row execute function public.set_updated_at();

drop trigger if exists set_admin_users_updated_at on public.admin_users;
create trigger set_admin_users_updated_at
before update on public.admin_users
for each row execute function public.set_updated_at();

drop trigger if exists set_construction_packages_updated_at on public.construction_packages;
create trigger set_construction_packages_updated_at
before update on public.construction_packages
for each row execute function public.set_updated_at();

drop trigger if exists set_package_materials_updated_at on public.package_materials;
create trigger set_package_materials_updated_at
before update on public.package_materials
for each row execute function public.set_updated_at();

drop trigger if exists set_package_quote_requests_updated_at on public.package_quote_requests;
create trigger set_package_quote_requests_updated_at
before update on public.package_quote_requests
for each row execute function public.set_updated_at();

drop trigger if exists set_media_assets_updated_at on public.media_assets;
create trigger set_media_assets_updated_at
before update on public.media_assets
for each row execute function public.set_updated_at();

drop trigger if exists set_seo_drafts_updated_at on public.seo_drafts;
create trigger set_seo_drafts_updated_at
before update on public.seo_drafts
for each row execute function public.set_updated_at();

drop trigger if exists set_policy_pages_updated_at on public.policy_pages;
create trigger set_policy_pages_updated_at
before update on public.policy_pages
for each row execute function public.set_updated_at();

insert into public.admin_users (
  email,
  name,
  role,
  status,
  password_salt,
  password_hash
)
values (
  'Admin@buildcivil.com',
  'BuildCivil Super Admin',
  'super_admin',
  'active',
  'f7109391bad6f9af06ff666a9b727e4e',
  '8435bca69c357764bf47c2be91b212494d0325dcf7ad90841cb9e4a3456e6e85204d355ea7cc45d64a8e932daf3c6646c1a2d0fc1906556c5e77fba978db886b'
)
on conflict (email) do update
set
  name = excluded.name,
  role = excluded.role,
  status = excluded.status,
  password_salt = excluded.password_salt,
  password_hash = excluded.password_hash,
  updated_at = now();

-- Keep exposed public tables closed to anon/authenticated clients while
-- allowing protected server routes to manage CMS data with service_role.
grant usage on schema public to service_role;

do $$
declare
  table_name text;
  managed_tables text[] := array[
    'admin_users',
    'brand_assets',
    'cms_revisions',
    'construction_packages',
    'contact_messages',
    'form_definitions',
    'media_assets',
    'newsletter_subscribers',
    'package_materials',
    'package_quote_requests',
    'policy_pages',
    'projects',
    'seo_drafts',
    'service_enquiries',
    'services',
    'site_navigation',
    'site_pages',
    'site_sections',
    'site_settings',
    'site_theme'
  ];
begin
  foreach table_name in array managed_tables loop
    if to_regclass(format('public.%I', table_name)) is not null then
      execute format('alter table public.%I enable row level security', table_name);
      execute format('revoke all on table public.%I from anon', table_name);
      execute format('revoke all on table public.%I from authenticated', table_name);
      execute format('grant select, insert, update, delete on table public.%I to service_role', table_name);
      execute format('drop policy if exists deny_direct_client_access on public.%I', table_name);
      execute format('drop policy if exists service_role_admin_access on public.%I', table_name);
      execute format(
        'create policy deny_direct_client_access on public.%I for all to anon, authenticated using (false) with check (false)',
        table_name
      );
      execute format(
        'create policy service_role_admin_access on public.%I for all to service_role using (true) with check (true)',
        table_name
      );
    end if;
  end loop;
end
$$;

grant usage, select on all sequences in schema public to service_role;
