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
  | 'SCIENTIFIC_ECOSYSTEM__EVENTS'
  | 'SCIENTIFIC_ECOSYSTEM__CONTACT';

export interface ScientificEcosystemDetailAboutUs {
  TYPE: ScientificEcosystemDetailResourceType;
  description: string[];
  generalObjective: string;
  specificObjectives: string[];
}

export interface ScientificEcosystemDetailGeneralObjective {
  TYPE: ScientificEcosystemDetailResourceType;
}

export interface ScientificEcosystemDetailSpecificObjectives {
  TYPE: ScientificEcosystemDetailResourceType;
}

export interface ScientificEcosystemDetailRoadmap {
  TYPE: ScientificEcosystemDetailResourceType;
}

export interface ScientificEcosystemDetailGuidelines {
  TYPE: ScientificEcosystemDetailResourceType;
}

export interface ScientificEcosystemDetailHowToParticipate {
  TYPE: ScientificEcosystemDetailResourceType;
}

export interface ScientificEcosystemDetailMembers {
  TYPE: ScientificEcosystemDetailResourceType;
}

export interface ScientificEcosystemDetailProjects {
  TYPE: ScientificEcosystemDetailResourceType;
}

export interface ScientificEcosystemDetailEvents {
  TYPE: ScientificEcosystemDetailResourceType;
}

export interface ScientificEcosystemDetailContact {
  TYPE: ScientificEcosystemDetailResourceType;
}
