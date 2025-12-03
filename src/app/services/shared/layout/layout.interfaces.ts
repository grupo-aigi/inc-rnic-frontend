export type SidebarMode = 'FULL' | 'MEDIUM' | 'COLLAPSED';

export interface SidebarMediumOption {
  id: string;
  label: { es: string; en: string };
  icon?: string;
  route?: string;
  open: boolean;
  other?: { badge: number };
  children?: SidebarMediumOption[];
  display: boolean;
}

export interface SidebarOption {
  label: { es: string; en: string };
  icon?: string;
  route: string;
  open: boolean;
  other?: { badge: number };
  children?: SidebarOption[];
  display: boolean;
}

export enum SidebarWidth {
  FULL = '300px',
  MEDIUM = '95px',
  COLLAPSED = '0px',
}
