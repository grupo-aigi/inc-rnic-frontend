import { Filetypes } from '../resources/resource.interfaces';

export interface Resource {
  id: number;
  resourceType: string;
  content: string;
}

export type ResourceContent =
  | ResourceContentType1
  | ResourceContentType2
  | ResourceContentType3
  | ResourceContentType4
  | ResourceContentType5
  | ResourceContentType6
  | ResourceContentType7
  | ResourceContentType8
  | ResourceContentType9
  | ResourceContentType10
  | ResourceContentType11
  | ResourceContentType12
  | ResourceContentType13
  | ResourceContentType14;

export type ContentResourceType =
  | 'CONTENT__TITLE_AND_PARAGRAPH'
  | 'CONTENT__TITLE_SUBTITLE_AND_PARAGRAPH'
  | 'CONTENT__TITLE_PARAGRAPHS_AND_IMAGES'
  | 'CONTENT__TITLE_PARAGRAPHS_AND_LIST_ITEMS'
  | 'CONTENT__TITLE_TOGGLE_ITEMS_AND_IMAGE'
  | 'CONTENT__TITLE_PARAGRAPHS_AND_SORTED_OR_UNSORTED_LIST'
  | 'CONTENT__QUOTES_FEEDBACKS_OR_REFERENCES_1'
  | 'CONTENT__QUOTES_FEEDBACKS_OR_REFERENCES_2'
  | 'CONTENT__QUOTE_AND_AUTHOR'
  | 'CONTENT__DYNAMIC_BANNER'
  | 'CONTENT__VIDEO_AND_REFERENCES'
  | 'CONTENT__MAP'
  | 'CONTENT__FILES'
  | 'CONTENT__LINK';

export type ContentTarget = 'events' | 'news' | 'convocations' | 'ecosystems';

export interface ResourceContentType1 {
  TYPE: ContentResourceType;
  title: string;
  paragraphs: string[];
}

export interface ResourceContentType2 {
  TYPE: ContentResourceType;
  title: string;
  subtitle: string;
  paragraphs: string[];
}

export interface ResourceContentType3 {
  TYPE: ContentResourceType;
  title: string;
  paragraphs: string[];
  images: string[];
}

export interface ResourceContentType4 {
  TYPE: ContentResourceType;
  title: string;
  paragraphs: string[];
  items: string[];
}

export interface ResourceContentType5 {
  TYPE: ContentResourceType;
  title: string;
  paragraphs: string[];
  items: { title: string; content: string }[];
  imageName: string;
}

export interface ResourceContentType6 {
  TYPE: ContentResourceType;
  title: string;
  paragraphs: string[];
  items: string[];
  listType: 'ordered' | 'unordered';
}

export interface Quote {
  author: string;
  role: string;
  content: string;
  imageName: string;
}

export interface ResourceContentType7 {
  TYPE: ContentResourceType;
  title: string;
  paragraphs: string[];
  quotes: Quote[];
}

export interface ResourceContentType8 {
  TYPE: ContentResourceType;
  title: string;
  paragraphs: string[];
  quotes: Quote[];
}

export interface ResourceContentType9 {
  TYPE: ContentResourceType;
  quote: string;
  author: string;
  role: string;
}

export interface ResourceContentType10 {
  TYPE: ContentResourceType;
  bannerItems: {
    url: string;
    image: string;
  }[];
}

export interface ResourceContentType11 {
  TYPE: ContentResourceType;
  youtubeLink: string;
  title: string;
  paragraphs: string[];
  source: string;
}

export interface ResourceContentType12 {
  TYPE: ContentResourceType;
  mapLink: string;
  detail: string;
}

export interface ResourceContentFile {
  id?: number;
  filename: string;
  filetype: Filetypes;
  originalFilename: string;
  size: number;
}

export interface ResourceContentType13 {
  TYPE: ContentResourceType;
  resources: ResourceContentFile[];
}

export interface ResourceContentType14 {
  TYPE: ContentResourceType;
  text: string;
  url: string;
}
