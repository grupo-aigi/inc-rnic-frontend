// import { ResourceContent } from '../../shared/contents/contents.interfaces';

import { ResourceContent } from '../../shared/contents/contents.interfaces';

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
