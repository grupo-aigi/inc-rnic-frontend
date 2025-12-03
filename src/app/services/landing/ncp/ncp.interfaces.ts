export interface NCPInfo {
  id?: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  videoUrl: string;
  email: string;
  links: { url: string; description: string }[];
  imageName: string;
  updatedAt: Date;
}
