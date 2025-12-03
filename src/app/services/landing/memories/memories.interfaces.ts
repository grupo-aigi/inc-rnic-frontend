export interface MemoryInfo {
  id?: number;
  title: string;
  youtubeVideoId: string;
  paragraphs: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RecommendedMemory {
  id: number;
  title: string;
  youtubeVideoUrl: string;
  createdAt: Date;
}

export interface MemoriesFilterCriteria {
  busqueda: string;
  pagina: number;
  cantidad: number;
}

export interface MemoriesResponse {
  count: number;
  records: MemoryInfo[];
}
