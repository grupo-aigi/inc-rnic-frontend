import {
  Resource,
  ResourceContent,
  ResourceContentFile,
} from '../../shared/contents/contents.interfaces';

// Convocation card info
export interface ConvocationBaseInfo {
  id?: number;
  title: string;
  description: string;
  imageName: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  category: ConvocationCategory;
  scope: ConvocationScope;
  files: ConvocationArchive[];
}

export enum ConvocationScope {
  NATIONAL = 'NATIONAL',
  INTERNATIONAL = 'INTERNATIONAL',
}

export type ConvocationBaseInfoBody = Omit<
  ConvocationBaseInfo,
  'category' | 'files'
> & {
  categoryId: number;
  filesIds: number[];
};

export interface ConvocationCreateInfo {
  baseInfo: ConvocationBaseInfoBody;
  resources: ResourceContent[];
}

export interface ConvocationFilterCriteria {
  busqueda?: string;
  categoriaId?: number;
  desde?: number;
  hasta?: number;
  tipo?: 'NATIONAL' | 'INTERNATIONAL';
}

export interface DateRange {
  start: number;
  end: number;
}

export interface ConvocationCategory {
  id: number;
  name: string;
}

export interface ConvocationArchive {
  id?: number;
  filename: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConvocationType {
  id: string;
  name: string;
}

export interface ConvocationSearchRecommendation {
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

export interface ConvocationPoster {
  id: number;
  title: string;
  description: string;
  imageName: string;
  urlName: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  status: string;
  scope: ConvocationScope;
  files: ConvocationArchive[];
  category: ConvocationCategory;
  resources: Resource[];
}

// export interface ResourceContent {
//   id: number;
//   resourceType: string;
//   content: string;
// }

export interface PageDetail {
  page: number;
  size: number;
}

export interface ConvocationsResponse {
  records: ConvocationPoster[];
  total: number;
}
