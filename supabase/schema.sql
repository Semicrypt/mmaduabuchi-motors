create extension if not exists pgcrypto;

create schema if not exists private;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null,
  model text not null,
  year integer,
  price numeric(15,2),
  currency text not null default 'NGN',
  mileage integer,
  transmission text,
  color text,
  fuel_type text,
  condition text,
  location text,
  description text,
  status text not null default 'available'
    check (status in ('available', 'reserved', 'sold', 'hidden')),
  featured boolean not null default false,
  cover_image_url text,
  video_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vehicle_media (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video')),
  url text not null,
  storage_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists vehicles_status_idx on public.vehicles(status);
create index if not exists vehicles_featured_idx on public.vehicles(featured);
create index if not exists vehicles_created_at_idx on public.vehicles(created_at desc);
create index if not exists vehicle_media_vehicle_id_idx on public.vehicle_media(vehicle_id);
create index if not exists vehicle_media_sort_order_idx on public.vehicle_media(vehicle_id, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists vehicles_set_updated_at on public.vehicles;
create trigger vehicles_set_updated_at
before update on public.vehicles
for each row
execute function public.set_updated_at();

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

alter table public.admin_users enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_media enable row level security;

revoke all on public.admin_users from anon, authenticated;
revoke all on public.vehicles from anon, authenticated;
revoke all on public.vehicle_media from anon, authenticated;

grant select on public.admin_users to authenticated;
grant select on public.vehicles to anon, authenticated;
grant insert, update, delete on public.vehicles to authenticated;
grant select on public.vehicle_media to anon, authenticated;
grant insert, update, delete on public.vehicle_media to authenticated;

-- Lets a signed-in user confirm only their own admin membership.
drop policy if exists "Admin can read own membership" on public.admin_users;
create policy "Admin can read own membership"
on public.admin_users
for select
to authenticated
using (user_id = (select auth.uid()));

-- Public site can see all inventory except hidden vehicles.
drop policy if exists "Public can view visible vehicles" on public.vehicles;
create policy "Public can view visible vehicles"
on public.vehicles
for select
to anon, authenticated
using (status <> 'hidden');

-- Admin can also see hidden inventory.
drop policy if exists "Admin can view all vehicles" on public.vehicles;
create policy "Admin can view all vehicles"
on public.vehicles
for select
to authenticated
using ((select private.is_admin()));

drop policy if exists "Admin can add vehicles" on public.vehicles;
create policy "Admin can add vehicles"
on public.vehicles
for insert
to authenticated
with check ((select private.is_admin()));

drop policy if exists "Admin can update vehicles" on public.vehicles;
create policy "Admin can update vehicles"
on public.vehicles
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "Admin can delete vehicles" on public.vehicles;
create policy "Admin can delete vehicles"
on public.vehicles
for delete
to authenticated
using ((select private.is_admin()));

-- Vehicle media can be read publicly. Hidden vehicle URLs are not surfaced by the public app.
drop policy if exists "Public can view vehicle media" on public.vehicle_media;
create policy "Public can view vehicle media"
on public.vehicle_media
for select
to anon, authenticated
using (true);

drop policy if exists "Admin can add vehicle media" on public.vehicle_media;
create policy "Admin can add vehicle media"
on public.vehicle_media
for insert
to authenticated
with check ((select private.is_admin()));

drop policy if exists "Admin can update vehicle media" on public.vehicle_media;
create policy "Admin can update vehicle media"
on public.vehicle_media
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "Admin can delete vehicle media" on public.vehicle_media;
create policy "Admin can delete vehicle media"
on public.vehicle_media
for delete
to authenticated
using ((select private.is_admin()));

-- Preview-stage storage bucket. Supabase Free currently caps a single upload at 50 MB.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'vehicle-media',
  'vehicle-media',
  true,
  52428800,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/quicktime'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage write access is admin-only.
drop policy if exists "Admins can upload vehicle media" on storage.objects;
create policy "Admins can upload vehicle media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'vehicle-media'
  and (select private.is_admin())
);

drop policy if exists "Admins can update vehicle media files" on storage.objects;
create policy "Admins can update vehicle media files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'vehicle-media'
  and (select private.is_admin())
)
with check (
  bucket_id = 'vehicle-media'
  and (select private.is_admin())
);

drop policy if exists "Admins can delete vehicle media files" on storage.objects;
create policy "Admins can delete vehicle media files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'vehicle-media'
  and (select private.is_admin())
);
