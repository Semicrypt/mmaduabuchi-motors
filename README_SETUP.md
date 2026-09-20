# MMADUABUCHI MOTORS Admin Starter

This starter mirrors the inventory approach used for Zuby Autos: Supabase PostgreSQL + Auth + Storage, with an owner-only admin dashboard and no public registration.

## 1) Install Supabase JS

From the MMADUABUCHI MOTORS project:

```bash
npm install @supabase/supabase-js
```

## 2) Create a Supabase project

Create a project at Supabase, then copy the Project URL and publishable/anon key into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_KEY
```

Restart Next.js after creating `.env.local`.

## 3) Run the database schema

Open Supabase -> SQL Editor -> New query.
Copy everything from `supabase/schema.sql`, run it once, and confirm it completes successfully.

The schema creates:
- `vehicles`
- `vehicle_media`
- `admin_users`
- RLS policies
- an admin-only helper function in the private schema
- a public `vehicle-media` Storage bucket

## 4) Create the owner's admin account

In Supabase -> Authentication -> Users, create the owner's email/password user manually. Do not add public registration to the website.

Copy the new user's UUID, then run this in SQL Editor:

```sql
insert into public.admin_users (user_id)
values ('PASTE_AUTH_USER_UUID_HERE');
```

## 5) Copy the starter files into your project

Copy:

- `src/lib/supabase.ts`
- `src/app/admin/login/page.tsx`
- `src/app/admin/page.tsx`

Do not replace your public homepage yet.

## 6) Run locally

```bash
npm run dev -- -p 3005
```

Visit:

- `http://localhost:3005/admin/login`
- `http://localhost:3005/admin`

## Admin capabilities in this starter

- Owner email/password login
- No public signup
- Add vehicles
- Edit vehicles
- Delete vehicles
- Status: Available / Reserved / Sold / Hidden
- Featured toggle
- Price/currency
- Mileage
- Condition
- Location: Cotonou / Lagos / Onitsha
- Transmission/fuel/colour/description
- Up to 15 photos per vehicle
- Cover photo selection
- Optional walkaround video
- Delete uploaded media
- Search and status filtering
- Dashboard counts

## Preview media limits

The UI accepts images up to 10 MB each and video up to 50 MB. Supabase's Free plan currently caps an individual upload at 50 MB. For production on AWS, vehicle media can be moved to S3/CloudFront and the database can later move from Supabase Postgres to AWS RDS if desired.

## Next integration step

After the admin dashboard works, update the public homepage `Popular Models` section to query `vehicles` from Supabase instead of the hard-coded array. This makes every vehicle added from `/admin` appear automatically on the public site.
