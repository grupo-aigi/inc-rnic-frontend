export interface NetworkParticipantInfo {
  id?: number;
  name: string;
  gender: 'M' | 'F' | 'O';
  roles: string[];
  displayContact: boolean;
  group: 'FACILITATOR' | 'COORDINATOR';
  contact: {
    linkedin: string;
    orcid: string;
    scopus: string;
  };
  imageName: string;
}
