export interface HomeDirectLink {
  title: { es: string; en: string };
  url: string;
  description: { es: string; en: string };
  icon: string;
}

export interface CommissionDirectLink {
  id: string;
  label: { es: string; en: string };
  route: string;
  description: { es: string; en: string };
}

export interface MinutesDirectLink {
  id: string;
  label: { es: string; en: string };
  route: string;
  description: { es: string; en: string };
  display: boolean;
}

export interface ContentDirectLink {
  id: string;
  label: { es: string; en: string };
  route: string;
  description: { es: string; en: string };
  icon: string;
}
