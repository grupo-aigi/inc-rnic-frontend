export type ContentType = 'image/png' | 'image/jpeg' | 'image/jpg';

export interface UploadedFile {
  filename: string;
  mimetype: string;
  size: number;
}

export type Filetypes =
  | 'PDF'
  | 'WORD'
  | 'PLAIN_TEXT'
  | 'EXCEL'
  | 'CSV'
  | 'COMPRESSED_FILE';

export type ImageDirectory =
  | 'announcements'
  | 'convocations'
  | 'events'
  | 'news'
  | 'publications'
  | 'groups'
  | 'supporters'
  | 'partners'
  | 'ncp'
  | 'profiles';

export const mimeTypes = [
  {
    filetype: 'PDF',
    mimeTypes: ['application/pdf'],
  },
  {
    filetype: 'WORD',
    mimeTypes: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
  {
    filetype: 'PLAIN_TEXT',
    mimeTypes: ['text/plain'],
  },
  {
    filetype: 'EXCEL',
    mimeTypes: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
  {
    filetype: 'CSV',
    mimeTypes: ['text/csv'],
  },
  {
    filetype: 'COMPRESSED_FILE',
    mimeTypes: [
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/x-tar',
    ],
  },
];
