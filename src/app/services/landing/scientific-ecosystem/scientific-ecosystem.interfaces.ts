import { ResourceContentFile } from '../../shared/contents/contents.interfaces';
import { EventPoster } from '../event/event.interfaces';
import { NewsPoster } from '../news/news.interfaces';

export interface ScientificEcosystemBaseInfo {
  id?: number;
  title: string;
}

export type ScientificEcosystemBaseInfoBody = ScientificEcosystemBaseInfo;
export interface DateRange {
  start: number;
  end: number;
}

export interface ScientificEcosystemCategory {
  id: number;
  name: string;
}

export interface ScientificEcosystemTag {
  id: number;
  name: string;
}

export interface ScientificEcosystemType {
  id: string;
  name: string;
}

export interface ScientificEcosystemSearchRecommendation {
  id: number;
  title: string;
  urlName: string;
  startDate: Date;
  endDate: Date;
  category: {
    id: number;
    name: string;
  };
}

export interface ScientificEcosystemPoster {
  id: number;
  title: string;
  urlName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScientificEcosystemResource {}

export interface ScientificEcosystemCreateInfo {
  baseInfo: ScientificEcosystemBaseInfoBody;
  detail: ScientificEcosystemDetail;
}

export interface ScientificEcosystemSection {
  id: string;
  title: { es: string; en: string };
  content: { es: string; en: string };
}

export interface ScientificEcosystemDetail {
  sections: ScientificEcosystemSection[];
}

// AboutUs;
// GeneralObjective;
// SpecificObjectives;
// Roadmap;
// Guidelines;
// HowToParticipate;
// Members;
// Projects;
// Events;
// Contact;

export interface ScientificEcosystemData {
  id: number;
  title: string;
  urlName: string;
  sections: ScientificEcosystemDetailType[];
}

export type ScientificEcosystemDetailType =
  | ScientificEcosystemDetailAboutUs
  | ScientificEcosystemDetailGeneralObjective
  | ScientificEcosystemDetailSpecificObjectives
  | ScientificEcosystemDetailRoadmap
  | ScientificEcosystemDetailGuidelines
  | ScientificEcosystemDetailHowToParticipate
  | ScientificEcosystemDetailMembers
  | ScientificEcosystemDetailProjects
  | ScientificEcosystemDetailEvents
  | ScientificEcosystemDetailNews
  | ScientificEcosystemDetailContact;

export type ScientificEcosystemDetailResourceType =
  | 'NOSOTROS'
  | 'OBJ_GENERAL'
  | 'OBJ_ESPECIFICOS'
  | 'HOJA_RUTA'
  | 'LINEAMIENTOS'
  | 'COMO_PARTICIPAR'
  | 'INTEGRANTES'
  | 'PROYECTOS'
  | 'EVENTOS'
  | 'NOTICIAS'
  | 'CONTACTO';

export const ALL_SCIENTIFIC_ECOSYSTEM_SECTIONS: ScientificEcosystemDetailResourceType[] =
  [
    'NOSOTROS',
    'OBJ_GENERAL',
    'OBJ_ESPECIFICOS',
    'HOJA_RUTA',
    'LINEAMIENTOS',
    'COMO_PARTICIPAR',
    'INTEGRANTES',
    'PROYECTOS',
    'EVENTOS',
    'NOTICIAS',
    'CONTACTO',
  ];

export const SCIENTIFIC_ECOSYSTEM_SECTIONS_MAP: {
  [key in ScientificEcosystemDetailResourceType]: { es: string; en: string };
} = {
  NOSOTROS: {
    es: 'Nosotros',
    en: 'About Us',
  },
  OBJ_GENERAL: {
    es: 'Objetivo General',
    en: 'General Objective',
  },
  OBJ_ESPECIFICOS: {
    es: 'Objetivos Específicos',
    en: 'Specific Objectives',
  },
  HOJA_RUTA: {
    es: 'Hoja de Ruta',
    en: 'Roadmap',
  },
  LINEAMIENTOS: {
    es: 'Lineamientos',
    en: 'Guidelines',
  },
  COMO_PARTICIPAR: {
    es: 'Cómo Participar',
    en: 'How to Participate',
  },
  INTEGRANTES: {
    es: 'Miembros',
    en: 'Members',
  },
  PROYECTOS: {
    es: 'Proyectos',
    en: 'Projects',
  },
  EVENTOS: {
    es: 'Eventos',
    en: 'Events',
  },
  NOTICIAS: {
    es: 'Noticias',
    en: 'News',
  },
  CONTACTO: {
    es: 'Contacto',
    en: 'Contact',
  },
};

export interface ScientificEcosystemDetailAboutUs {
  TYPE: ScientificEcosystemDetailResourceType;
  description: string[];
}

export interface ScientificEcosystemDetailGeneralObjective {
  TYPE: ScientificEcosystemDetailResourceType;
  generalObjective: string;
}

export interface ScientificEcosystemDetailSpecificObjectives {
  TYPE: ScientificEcosystemDetailResourceType;
  specificObjectives: string[];
}

export interface ScientificEcosystemDetailRoadmap {
  TYPE: ScientificEcosystemDetailResourceType;
  resources: ResourceContentFile[];
}

export interface ScientificEcosystemDetailGuidelines {
  TYPE: ScientificEcosystemDetailResourceType;
  resources: ResourceContentFile[];
}

export interface ScientificEcosystemDetailHowToParticipate {
  TYPE: ScientificEcosystemDetailResourceType;
}

export interface ScientificEcosystemDetailMembers {
  TYPE: ScientificEcosystemDetailResourceType;
  title: string;
  paragraphs: string[];
  images: string[];
}

export interface ScientificEcosystemDetailProjects {
  TYPE: ScientificEcosystemDetailResourceType;
  projects: { name: string; author: string; objectives: string[] }[];
}

export interface ScientificEcosystemDetailEvents {
  TYPE: ScientificEcosystemDetailResourceType;
  events: EventPoster[];
}

export interface ScientificEcosystemDetailNews {
  TYPE: ScientificEcosystemDetailResourceType;
  news: NewsPoster[];
}

export interface ScientificEcosystemDetailContact {
  TYPE: ScientificEcosystemDetailResourceType;
  contacts: { name: string; role: string; email: string }[];
}
