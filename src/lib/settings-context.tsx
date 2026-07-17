import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  instagram_url: string;
  facebook_url: string;
  tripadvisor_url: string;
  booking_url: string;
  intro_text: string;
};

const DEFAULTS: SiteSettings = {
  whatsapp: "+212661267213",
  phone: "+212524895666",
  email: "contact@aubergelefestival.com",
  address: "Gorges du Todra, Tinghir, Maroc",
  instagram_url: "",
  facebook_url: "",
  tripadvisor_url: "",
  booking_url: "",
  intro_text: "",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!mounted) return;
        if (data) {
          const cleaned = Object.fromEntries(
            Object.entries(data).filter(([, v]) => v != null && v !== ""),
          ) as Partial<SiteSettings>;
          setSettings({ ...DEFAULTS, ...cleaned });
        }
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { settings, loading };
}

export function whatsappHref(number: string, msg = "Bonjour, je souhaite réserver à l'Auberge Le Festival.") {
  const clean = number.replace(/[^\d]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
}
