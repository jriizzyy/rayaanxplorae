# Migrate from Convex to Supabase

- Use `supabase_schema.sql`.
- Export Convex data via a temporary admin route; delete after.
- Import using Node + @supabase/supabase-js (service role).
- Replace data calls with Supabase clients (public + service).
- Keep webhook to write orders/downloads; clear cart depending on provider.
- Phase switch using CART_PROVIDER env; migrate carts later or now.
