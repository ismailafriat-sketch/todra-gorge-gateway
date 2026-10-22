-- 1. Rooms: add display fields the public pages render
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS long_description text DEFAULT '';
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS beds text DEFAULT '';
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS size integer;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS featured boolean DEFAULT true;

-- Backfill display fields + working image URLs for existing rooms
UPDATE public.rooms SET
  slug = 'double-standard',
  beds = '1 lit double',
  size = 18,
  featured = true,
  long_description = 'Une chambre confortable avec vue sur la palmeraie, idéale pour les voyageurs. Murs en terre crue, tapis berbères et salle de bain privative.',
  images = ARRAY['/__l5e/assets-v1/4af2edfd-7c44-4b92-bd11-f2c39e07d701/room_2.jpg','/__l5e/assets-v1/a0818def-91f8-49d7-9de1-836fa7d88ed7/room_5.jpg']
WHERE title = 'Double Standard';

UPDATE public.rooms SET
  slug = 'chambre-troglodyte',
  beds = '1 lit double',
  size = 20,
  featured = true,
  long_description = 'Une chambre creusée dans la roche, atmosphère unique et fraîcheur naturelle, au cœur même de la falaise.',
  images = ARRAY['/__l5e/assets-v1/4917df23-13b9-44be-846e-c1d43e2505db/room_18.jpg','/__l5e/assets-v1/474c1bbf-66ef-4def-a54f-58e15003412d/room_18b.jpg']
WHERE title = 'Chambre Troglodyte';

UPDATE public.rooms SET
  slug = 'familiale-zellige',
  beds = '4 lits',
  size = 32,
  featured = true,
  long_description = 'Chambre familiale spacieuse pour 4 personnes, avec lits jumeaux, plafond en pierre et fenêtres en arche baignées de soleil.',
  images = ARRAY['/__l5e/assets-v1/df00a26d-2717-4264-8e43-fcde0873b11a/room_16.jpg','/__l5e/assets-v1/280d8134-cd0d-4ba1-8813-b8a42e4a1935/room_17.jpg']
WHERE title = 'Familiale Zellige';

UPDATE public.rooms SET
  slug = 'appartement',
  beds = '2 lits doubles + salon',
  size = 45,
  featured = true,
  long_description = 'Appartement indépendant avec salon privé, cuisine et terrasse — idéal pour les familles et les longs séjours.',
  images = ARRAY['/__l5e/assets-v1/c43d56bf-43c7-43c0-94e3-618cdd368fb3/room_7.jpg','/__l5e/assets-v1/598ee97c-c865-4371-9c3a-5392897120c1/room_8.jpg']
WHERE title = 'Appartement';

UPDATE public.rooms SET slug = 'chambre-' || replace(lower(coalesce(slug, title)), ' ', '-') WHERE slug IS NULL OR slug = '';

-- 2. Gallery photos table
CREATE TABLE public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'La maison',
  image_url text not null,
  caption text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
GRANT SELECT ON public.gallery_photos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_photos TO authenticated;
GRANT ALL ON public.gallery_photos TO service_role;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read gallery photos" ON public.gallery_photos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage gallery photos" ON public.gallery_photos FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Seed the gallery with the auberge''s own photos
INSERT INTO public.gallery_photos (title, category, image_url, caption, sort_order) VALUES
  ('Piscine de pierre', 'La maison', '/__l5e/assets-v1/a506f3fb-cb1b-4b33-892c-4273bee864bc/pool.jpg', 'La piscine taillée dans la pierre face au ksar', 1),
  ('Terrasse panoramique', 'La maison', '/__l5e/assets-v1/312c67b5-5aac-4da9-8f77-ee438982d71b/terrace.jpg', 'La longue terrasse ouverte sur le canyon', 2),
  ('Vallée de Tinghir', 'La maison', '/__l5e/assets-v1/283d85ca-0813-4ce0-b21b-e90d2470edda/valley.jpg', 'La palmeraie verte et les montagnes', 3),
  ('Le ksar la nuit', 'La maison', '/__l5e/assets-v1/fbed8695-57da-4258-b4db-3603e6dec48a/night_ksar.jpg', 'L''auberge illuminée sous les étoiles', 4),
  ('Piscine la nuit', 'La maison', '/__l5e/assets-v1/f69b9b1b-adb7-4ebb-8e3b-c7d73c1b2950/night_pool.jpg', 'La piscine éclairée le soir', 5),
  ('Vue depuis la terrasse', 'La maison', '/__l5e/assets-v1/78121bc0-b509-4457-86ec-c87925e5ae70/unnamed_25.jpg', 'La piscine et les gorges depuis la terrasse', 6),
  ('Chambre en pierre', 'Les chambres', '/__l5e/assets-v1/528abf4b-32c4-4ade-bf69-17177c2e16ce/room_11.jpg', 'Murs de pierre et couvertures rouges', 10),
  ('Lit douillet', 'Les chambres', '/__l5e/assets-v1/204de5d0-36eb-4c84-b422-8fa84be24bdd/room_12.jpg', 'Chambre double aux couvertures rouges', 11),
  ('Lits jumeaux', 'Les chambres', '/__l5e/assets-v1/df00a26d-2717-4264-8e43-fcde0873b11a/room_16.jpg', 'Plafond en pierre et couvertures jaunes', 12),
  ('Literie orange', 'Les chambres', '/__l5e/assets-v1/280d8134-cd0d-4ba1-8813-b8a42e4a1935/room_17.jpg', 'Chambre aux tons chauds', 13),
  ('Chambre troglodyte', 'Les chambres', '/__l5e/assets-v1/4917df23-13b9-44be-846e-c1d43e2505db/room_18.jpg', 'Une chambre creusée dans la roche', 14),
  ('Chambre troglodyte 2', 'Les chambres', '/__l5e/assets-v1/474c1bbf-66ef-4def-a54f-58e15003412d/room_18b.jpg', 'Le passage en arche de la chambre troglodyte', 15),
  ('Chambre troglodyte 3', 'Les chambres', '/__l5e/assets-v1/df2ce3ad-2c26-4a9a-935b-10abf8b3b27d/unnamed_22.jpg', 'Lit et arches rouges de la chambre troglodyte', 16),
  ('Chambre lumineuse', 'Les chambres', '/__l5e/assets-v1/83ca1725-c7b1-4fb2-b149-15db302cddbf/unnamed_23.jpg', 'Deux lits et fenêtres en arche', 17),
  ('Salon berbère', 'La table & salons', '/__l5e/assets-v1/6b2bb9fc-7a9a-4614-8862-2ad8b7565cd8/salon.jpg', 'Banquettes et tables basses traditionnelles', 20),
  ('Salle à manger', 'La table & salons', '/__l5e/assets-v1/06f33830-c077-4bec-858a-3a8900e92f84/dining_room.jpg', 'Tables en zellige et murs de pierre', 21),
  ('Salon commun', 'La table & salons', '/__l5e/assets-v1/073f8fc7-8070-469b-b554-b1873b25301f/lounge.jpg', 'Le grand salon commun avec sa guitare', 22),
  ('Dîner aux chandelles', 'La table & salons', '/__l5e/assets-v1/1d0848e7-497b-4453-b314-5f32d71448ec/dining_candlelit.jpg', 'Un dîner servi aux chandelles', 23),
  ('Tagines du jour', 'La table & salons', '/__l5e/assets-v1/efe59e59-9a83-40e7-aad9-1feb6eb7d6b0/unnamed_27.jpg', 'Tagines mijotés aux légumes du marché', 24),
  ('Petit-déjeuner berbère', 'La table & salons', '/__l5e/assets-v1/5d0c8001-c587-4fa0-8ab3-f317b4b6da0d/unnamed_28.jpg', 'Café, pain, confitures et olives', 25),
  ('Soupe du jour', 'La table & salons', '/__l5e/assets-v1/198e9fc9-44c9-487a-a9bb-c054927928c1/unnamed_29.jpg', 'Harira servie sur céramique locale', 26),
  ('Tagine aux courgettes', 'La table & salons', '/__l5e/assets-v1/424b5456-ecb1-42b8-b2c0-b97e923f84e5/unnamed_21.jpg', 'Tagine du jardin', 27),
  ('Salle de bain tadelakt', 'Salles de bain', '/__l5e/assets-v1/fd1ac797-907f-40ba-b8ca-c03b0ea4e06c/bath_wc.jpg', 'Tadelakt rose et vasque en pierre', 30),
  ('Douche traditionnelle', 'Salles de bain', '/__l5e/assets-v1/e0716241-4956-4bde-bf48-94d398ba3000/bath_shower.jpg', 'Douche aux murs ocre', 31),
  ('Baignoire bleue', 'Salles de bain', '/__l5e/assets-v1/3dbcd26d-4d26-4348-9b86-f9862ccb419e/unnamed_30.jpg', 'Tadelakt rouge et baignoire en zellige bleu', 32);

-- 3. Contact messages table
CREATE TABLE public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null default '',
  created_at timestamptz not null default now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a contact message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read contact messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete contact messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. Realtime for all content tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.excursions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_photos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;

-- 5. Ensure Data API grants on existing tables
GRANT SELECT ON public.rooms, public.excursions, public.site_settings TO anon, authenticated;
GRANT INSERT ON public.bookings TO anon, authenticated;

-- 6. Grant the existing account the admin role
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role FROM auth.users u
WHERE u.email = 'afriat.ismail@gmail.com'
  AND NOT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = u.id AND ur.role = 'admin'::app_role);