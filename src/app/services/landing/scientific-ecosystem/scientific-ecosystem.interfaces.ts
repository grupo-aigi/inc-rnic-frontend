import { ResourceContentFile } from '../../shared/contents/contents.interfaces';

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
  | ScientificEcosystemDetailContact;

export type ScientificEcosystemDetailResourceType =
  | 'SCIENTIFIC_ECOSYSTEM__ABOUT_US'
  | 'SCIENTIFIC_ECOSYSTEM__GENERAL_OBJECTIVE'
  | 'SCIENTIFIC_ECOSYSTEM__SPECIFIC_OBJECTIVES'
  | 'SCIENTIFIC_ECOSYSTEM__ROADMAP'
  | 'SCIENTIFIC_ECOSYSTEM__GUIDELINES'
  | 'SCIENTIFIC_ECOSYSTEM__HOW_TO_PARTICIPATE'
  | 'SCIENTIFIC_ECOSYSTEM__MEMBERS'
  | 'SCIENTIFIC_ECOSYSTEM__PROJECTS'
  | 'SCIENTIFIC_ECOSYSTEM__CONTACT';

export const ALL_SCIENTIFIC_ECOSYSTEM_SECTIONS: ScientificEcosystemDetailResourceType[] =
  [
    'SCIENTIFIC_ECOSYSTEM__ABOUT_US',
    'SCIENTIFIC_ECOSYSTEM__GENERAL_OBJECTIVE',
    'SCIENTIFIC_ECOSYSTEM__SPECIFIC_OBJECTIVES',
    'SCIENTIFIC_ECOSYSTEM__ROADMAP',
    'SCIENTIFIC_ECOSYSTEM__GUIDELINES',
    'SCIENTIFIC_ECOSYSTEM__HOW_TO_PARTICIPATE',
    'SCIENTIFIC_ECOSYSTEM__MEMBERS',
    'SCIENTIFIC_ECOSYSTEM__PROJECTS',
    'SCIENTIFIC_ECOSYSTEM__CONTACT',
  ];

export const SCIENTIFIC_ECOSYSTEM_SECTIONS_MAP: {
  [key in ScientificEcosystemDetailResourceType]: { es: string; en: string };
} = {
  SCIENTIFIC_ECOSYSTEM__ABOUT_US: {
    es: 'Nosotros',
    en: 'About Us',
  },
  SCIENTIFIC_ECOSYSTEM__GENERAL_OBJECTIVE: {
    es: 'Objetivo General',
    en: 'General Objective',
  },
  SCIENTIFIC_ECOSYSTEM__SPECIFIC_OBJECTIVES: {
    es: 'Objetivos Específicos',
    en: 'Specific Objectives',
  },
  SCIENTIFIC_ECOSYSTEM__ROADMAP: {
    es: 'Hoja de Ruta',
    en: 'Roadmap',
  },
  SCIENTIFIC_ECOSYSTEM__GUIDELINES: {
    es: 'Lineamientos',
    en: 'Guidelines',
  },
  SCIENTIFIC_ECOSYSTEM__HOW_TO_PARTICIPATE: {
    es: 'Cómo Participar',
    en: 'How to Participate',
  },
  SCIENTIFIC_ECOSYSTEM__MEMBERS: {
    es: 'Miembros',
    en: 'Members',
  },
  SCIENTIFIC_ECOSYSTEM__PROJECTS: {
    es: 'Proyectos',
    en: 'Projects',
  },
  SCIENTIFIC_ECOSYSTEM__CONTACT: {
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

export interface ScientificEcosystemDetailContact {
  TYPE: ScientificEcosystemDetailResourceType;
  contacts: { name: string; role: string; email: string }[];
}
