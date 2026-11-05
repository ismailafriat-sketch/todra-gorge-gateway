<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Auberge Le Festival — site notes

## Architecture
- Single source of truth for all site data is `src/lib/data-context.tsx` (`DataProvider` + `useData()`), mounted in `src/main.tsx` around the whole app. It fetches rooms, excursions, gallery photos, site settings, bookings and contact messages from the database on load and keeps them live via one Supabase Realtime channel (`db-changes`) listening to all six tables. Public pages AND the admin portal must consume `useData()` — never add standalone `supabase.from(...)` fetches or local hardcoded data arrays in pages (fallbacks live inside the provider only, shown when the database is empty).
- The live app is the react-router app: `index.html` → `src/main.tsx` → `src/App.tsx` → `src/pages/*` with the `Navbar`/`Footer` components. The old TanStack scaffolding (`src/routes`, `src/components/ui`, etc.) was dead code and has been deleted — do not recreate it.
- All Supabase access goes through `src/integrations/supabase/client.ts` (re-exported by `src/lib/supabase.ts`); do not import the integration client with `@/` aliases — this tsconfig/vite config has no path alias, use relative imports.
- Admin uploads go to the `media` storage bucket (private) as 10-year signed URLs via `src/lib/media.ts`; seeded site photos also live in that bucket under `site/`.

## Bookings
- The public reservation form writes to the `bookings` table (guest_name, check_in/check_out, nights, room_selections jsonb, total_mad, notes, status `new`). Contact form writes to `contact_messages`. The old `reservations` table never existed — do not reference it.
- Payment processing (Stripe/PayPal) is NOT implemented; the form collects a request only (payment_method `pending`).

## Admin
- `/admin` tabs: Réservations (bookings), Messages, Chambres, Galerie, Excursions, Paramètres. Writes use RLS-protected tables; the account afriat.ismail@gmail.com has the admin role in `user_roles`.
