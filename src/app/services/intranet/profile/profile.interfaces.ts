import { DisplayPolicies } from '../../auth/auth.interfaces';
import { Commissions } from '../commissions/commissions.interfaces';

export interface UserProfileInfo {
  fullName: string;
  phoneNumber: string;
  description: string;
  linkedin: string;
  scopus: string;
  orcid: string;
  commissions: Commissions[];
  displayPolicies: DisplayPolicies;
}

export interface UserSocialMedia {
  linkedin: string;
  orcid: string;
  scopus: string;
}
