# Roadmap

## Done
- [x] Unified global data context (`src/lib/data-context.tsx`) with Supabase Realtime; all public pages + admin consume it
- [x] Public pages read live DB data (rooms, gallery, settings, excursions); booking + contact forms write to real tables
- [x] Admin portal: bookings, messages, rooms editor, gallery manager, excursions editor, contact settings
- [x] Real photos moved to permanent storage; broken asset URLs fixed

## Open (needs user decision / external setup)
- [ ] Real payment processing (Stripe or PayPal) for the reservation flow — currently the form records a request with payment "pending"; the earlier card/PayPal checkout mock is only in the old dead-code file, not rebuilt in the live app
- [ ] Gallery page: switch grid to a left/right slider (was built in the dead-code version; current live gallery is a filterable grid fed by the DB)
- [ ] Booking availability config (open dates, min/max nights) — the old BOOKING_CONFIG lived in the dead-code version
- [ ] Publish the site (user has not published yet)
