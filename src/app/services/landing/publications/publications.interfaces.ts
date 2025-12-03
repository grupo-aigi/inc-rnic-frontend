export interface PublicationInfo {
  id?: string;
  title: string;
  urlName?: string;
  filename: string;
  description: string;
  imageName: string;
  createdAt?: Date;
  updatedAt?: Date;
  archives?: PublicationInfo[]; // Defined for publications, but not for archives
}

export interface RecommendedPublication {
  id: number;
  title: string;
  urlName: string;
  imageName: string;
  createdAt: Date;
}

export interface PublicationsFilterCriteria {
  search: string;
  page: number;
  size: number;
}
