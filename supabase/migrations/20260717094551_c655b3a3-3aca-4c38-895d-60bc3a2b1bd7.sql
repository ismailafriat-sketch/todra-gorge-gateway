
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ SHARED updated_at trigger ============
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ============ ROOMS ============
CREATE TABLE public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  room_type text NOT NULL DEFAULT 'double',
  price_mad integer NOT NULL DEFAULT 0,
  description text DEFAULT '',
  images text[] NOT NULL DEFAULT '{}',
  amenities text[] NOT NULL DEFAULT '{}',
  capacity integer NOT NULL DEFAULT 2,
  is_available boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.rooms TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.rooms TO authenticated;
GRANT ALL ON public.rooms TO service_role;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read available rooms" ON public.rooms
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage rooms" ON public.rooms
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_rooms_updated_at BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ EXCURSIONS ============
CREATE TABLE public.excursions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  price_mad integer NOT NULL DEFAULT 0,
  duration text DEFAULT '',
  images text[] NOT NULL DEFAULT '{}',
  details text[] NOT NULL DEFAULT '{}',
  is_available boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.excursions TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.excursions TO authenticated;
GRANT ALL ON public.excursions TO service_role;
ALTER TABLE public.excursions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read excursions" ON public.excursions
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage excursions" ON public.excursions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_excursions_updated_at BEFORE UPDATE ON public.excursions
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ BOOKINGS ============
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE DEFAULT ('LF-' || upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 8))),
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text DEFAULT '',
  whatsapp text DEFAULT '',
  check_in date NOT NULL,
  check_out date NOT NULL,
  nights integer NOT NULL DEFAULT 1,
  room_selections jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_mad integer NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'card',
  payment_status text NOT NULL DEFAULT 'pending',
  stripe_session_id text,
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create a booking" ON public.bookings
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read bookings" ON public.bookings
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete bookings" ON public.bookings
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ SITE SETTINGS (single row) ============
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  address text DEFAULT '',
  instagram_url text DEFAULT '',
  facebook_url text DEFAULT '',
  tripadvisor_url text DEFAULT '',
  booking_url text DEFAULT '',
  intro_text text DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Seed one settings row + starter rooms so the site is not empty
INSERT INTO public.site_settings (whatsapp, phone, email, address, instagram_url, facebook_url)
VALUES ('+212661267213', '+212524895666', 'contact@aubergelefestival.com', 'Gorges du Todra, Tinghir, Maroc', '', '');

INSERT INTO public.rooms (title, room_type, price_mad, description, images, amenities, capacity, sort_order) VALUES
('Double Standard', 'double', 793, 'Chambre double confortable avec vue sur la gorge, décor berbère authentique.', ARRAY['/src/assets/rooms/room_2.jpg','/src/assets/rooms/room_5.jpg'], ARRAY['Salle de bain privée','Wi-Fi','Chauffage','Petit-déjeuner inclus'], 2, 1),
('Chambre Troglodyte', 'cave', 950, 'Une chambre creusée dans la roche, atmosphère unique et fraîche.', ARRAY['/src/assets/rooms/room_18.jpg','/src/assets/rooms/room_18b.jpg'], ARRAY['Vue montagne','Salle de bain','Wi-Fi','Petit-déjeuner inclus'], 2, 2),
('Familiale Zellige', 'family', 1200, 'Chambre familiale spacieuse pour 4 personnes, mosaïques traditionnelles.', ARRAY['/src/assets/rooms/room_16.jpg','/src/assets/rooms/room_17.jpg'], ARRAY['4 lits','Salle de bain','Wi-Fi','Balcon'], 4, 3),
('Appartement', 'apartment', 1485, 'Appartement indépendant avec salon, idéal pour long séjour.', ARRAY['/src/assets/rooms/room_7.jpg','/src/assets/rooms/room_8.jpg'], ARRAY['Salon privé','Cuisine','Wi-Fi','Terrasse'], 4, 4);

INSERT INTO public.excursions (title, description, price_mad, duration, details, sort_order) VALUES
('Randonnée dans la Gorge du Todra', 'Marche guidée à travers les falaises de 300m et la palmeraie.', 250, 'Demi-journée', ARRAY['Guide berbère local','Eau minérale','Départ 9h ou 15h'], 1),
('Trek au Jbel Saghro', 'Trek de 2 jours avec bivouac sous les étoiles.', 1500, '2 jours', ARRAY['Guide + muletier','Repas inclus','Tente et couchage'], 2),
('Excursion Merzouga (dunes)', 'Départ tôt le matin vers les dunes de l''erg Chebbi.', 1200, '1 jour', ARRAY['4x4 privatif','Balade à dos de dromadaire','Coucher de soleil'], 3);
