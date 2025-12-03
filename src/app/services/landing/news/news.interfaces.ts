import {
  Resource,
  ResourceContent,
} from '../../shared/contents/contents.interfaces';

export interface NewsFilterCriteria {
  busqueda?: string;
  categoriaId?: number;
  etiquetaId?: number;
  desde?: string;
  hasta?: string;
}

export interface NewsSearchRecommendation {
  id: number;
  title: string;
  urlName: string;
  category: {
    id: number;
    name: string;
  };
  updatedAt: Date;
}
export interface NewsType {}

export interface NewsBaseInfo {
  id?: number;
  title: string;
  description: string;
  author: string;
  date: Date;
  category: NewsCategory;
  tags: NewsTag[];
  imageName: string;
}

export interface NewsPoster extends NewsBaseInfo {
  relatedNews?: string[];
  urlName: string;
  createdAt: Date;
  updatedAt: Date;
  resources: Resource[];
}

export interface NewsCategory {
  id: number;
  name: string;
}

export interface NewsTag {
  id: number;
  name: string;
}

export interface NewsCategorySummary {
  id: number;
  name: string;
  count: number;
}

export interface NewsTagSummary {
  id: number;
  name: string;
  count: number;
}

export interface NewsYearlySummary {
  year: number;
  monthlyQuantities: MonthlyQuantity[];
}

export interface MonthlyQuantity {
  month: number;
  count: number;
}

export interface NewsResource {}

export type NewsBaseInfoBody = Omit<NewsBaseInfo, 'category' | 'tags'> & {
  categoryId: number;
  tagIdList: number[];
};

export interface NewsCreateInfo {
  baseInfo: NewsBaseInfoBody;
  resources: ResourceContent[];
}
