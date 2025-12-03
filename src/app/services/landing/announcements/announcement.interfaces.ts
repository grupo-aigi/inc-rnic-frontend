export interface AnnouncementInfo {
  id?: string;
  title: string;
  paragraphs: string[];
  issuedBy: string;
  deadlineDate: Date;
  imageName: string;
  createdAt?: Date;
}

export interface AnnouncementPoster extends AnnouncementInfo {
  createdAt: Date;
}
