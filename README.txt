MMADUABUCHI MOTORS — Inventory + Vehicle Detail Pages

Copy these files into your project:

1. src/app/inventory/page.tsx
2. src/app/cars/[id]/page.tsx
3. src/app/page.tsx  (updated homepage with links to /inventory and /cars/[id])

From the project root:

mkdir -p src/app/inventory
mkdir -p 'src/app/cars/[id]'

Then place the files in those exact locations.

Restart:
rm -rf .next
npm run dev -- -p 3005

Test:
http://localhost:3005/inventory
http://localhost:3005

Click a vehicle and confirm it opens:
http://localhost:3005/cars/<vehicle-id>

No database migration is required. These pages use the existing:
- vehicles
- vehicle_media
tables already created in Supabase.
