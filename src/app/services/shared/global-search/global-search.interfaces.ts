import { AppLocale } from '../lang/lang.interfaces';

export interface GlobalSearchRecommendation {
  type: SearchSectionType;
  records: {
    title: AppLocale | string;
    url: string;
    fragment?: string;
    breadCrumbs: AppLocale[];
    queryParams?: object;
    description?: string;
    category?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }[];
}

export interface SearchSection {
  id: number;
  type: SearchSectionType;
  label: { es: string; en: string };
  enabled: boolean;
}

// ---------------------------------------------------------------

export enum SearchSectionType {
  PROJECTS = 'projects',
  MINUTES = 'minutes',
  EVENTS = 'events',
  NEWS = 'news',
  CONVOCATIONS = 'convocations',
  PUBLICATIONS = 'publications',
  MEMORIES = 'memories',
  LANDING = 'landing',
  INTRANET = 'intranet',
}
