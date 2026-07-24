/*
# Create core tables for Auberge Le Festival

1. New Tables
- `rooms` — room listings displayed on the public site
  - id (uuid PK), name, slug, description, long_description, price_per_night (int),
    capacity (int), size (int), beds, amenities (text[]), image_url, gallery_urls (text[]),
    featured (boolean), created_at
- `reservations` — booking requests submitted by visitors
  - id (uuid PK), name, email, phone, check_in (date), check_out (date), guests (int),
    room_id (nullable FK -> rooms), message, status (text default 'pending'), created_at
- `contact_messages` — messages submitted via the contact form
  - id (uuid PK), name, email, subject, message, created_at

2. Security
- RLS enabled on all three tables.
- rooms: public SELECT (anon + authenticated) so the site can display listings;
  authenticated INSERT/UPDATE/DELETE for the admin.
- reservations: public INSERT so visitors can submit booking requests;
  authenticated SELECT/UPDATE/DELETE for the admin to review and manage them.
- contact_messages: public INSERT so visitors can send messages;
  authenticated SELECT/DELETE for the admin to read and clear them.
*/

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  long_description text NOT NULL,
  price_per_night integer NOT NULL,
  capacity integer NOT NULL DEFAULT 2,
  size integer NOT NULL DEFAULT 20,
  beds text NOT NULL,
  amenities text[] NOT NULL DEFAULT '{}',
  image_url text NOT NULL,
  gallery_urls text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_rooms" ON rooms;
CREATE POLICY "public_select_rooms" ON rooms FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_rooms" ON rooms;
CREATE POLICY "admin_insert_rooms" ON rooms FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_rooms" ON rooms;
CREATE POLICY "admin_update_rooms" ON rooms FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_rooms" ON rooms;
CREATE POLICY "admin_delete_rooms" ON rooms FOR DELETE
  TO authenticated USING (true);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests integer NOT NULL DEFAULT 2,
  room_id uuid REFERENCES rooms(id) ON DELETE SET NULL,
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_reservations" ON reservations;
CREATE POLICY "public_insert_reservations" ON reservations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_reservations" ON reservations;
CREATE POLICY "admin_select_reservations" ON reservations FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_reservations" ON reservations;
CREATE POLICY "admin_update_reservations" ON reservations FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_reservations" ON reservations;
CREATE POLICY "admin_delete_reservations" ON reservations FOR DELETE
  TO authenticated USING (true);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_messages" ON contact_messages;
CREATE POLICY "public_insert_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_messages" ON contact_messages;
CREATE POLICY "admin_select_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_delete_messages" ON contact_messages;
CREATE POLICY "admin_delete_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);
