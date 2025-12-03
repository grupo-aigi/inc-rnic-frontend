// import { ResourceContent } from '../../shared/contents/contents.interfaces';

import {
  Resource,
  ResourceContent,
} from '../../shared/contents/contents.interfaces';

export interface EventBaseInfo {
  id?: number;
  title: string;
  description: string;
  author: string;
  startDate: Date;
  endDate: Date;
  scope: 'NATIONAL' | 'INTERNATIONAL';
  category: EventCategory;
  tags: EventTag[];
  imageName: string;
}

export type EventBaseInfoBody = Omit<EventBaseInfo, 'category' | 'tags'> & {
  categoryId: number;
  tagIdList: number[];
};

export interface EventFilterCriteria {
  busqueda?: string;
  categoriaId?: number;
  etiquetaId?: number;
  desde?: string;
  hasta?: string;
  tipo?: 'NACIONAL' | 'INTERNACIONAL' | '';
}

export interface DateRange {
  start: number;
  end: number;
}

export interface EventCategory {
  id: number;
  name: string;
}

export interface EventTag {
  id: number;
  name: string;
}

export interface EventType {
  id: string;
  name: string;
}

export interface EventSearchRecommendation {
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

// export interface EventPoster {
//   id: string;
//   title: string;
//   description: string;
//   timestamp: number;
//   scope: 'NACIONAL' | 'INTERNACIONAL';
//   author: {
//     name: string;
//     email: string;
//     position: string;
//   };
//   image: string;
//   urlName: string;
// }

export interface EventPoster {
  id: number;
  title: string;
  description: string;
  imageName: string;
  urlName: string;
  startDate: Date;
  endDate: Date;
  author: string;
  scope: 'NATIONAL' | 'INTERNATIONAL';
  category: EventCategory;
  tags: EventTag[];
  resources: Resource[];
}

export interface EventResource {}

export interface EventCreateInfo {
  baseInfo: EventBaseInfoBody;
  resources: ResourceContent[];
}
