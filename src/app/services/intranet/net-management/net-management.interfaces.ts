import { DisplayPolicies } from '../../auth/auth.interfaces';
import { UserSocialMedia } from '../profile/profile.interfaces';

export interface NetworkRegistration {
  id: string;
  identification: number;
  name: string;
  email: string;
  phoneNumber: string;
  filename: string;
  createdAt: string;
  networkCommissions: string[];
  accountNonLocked: boolean;
}

export interface NetworkRetirement {
  userId: string;
  email: string;
  name: string;
  identification: number;
  disableType: string;
  reason: string;
  createdAt: string;
}

export interface RegistrationFilterCriteria {
  search?: string;
}

export interface RetirementFilterCriteria {
  search?: string;
}

export interface RegistrationSearchRecommendation {
  id: string;
  identification: string;
  email: string;
  name: string;
  accountNonLocked: boolean;
  createdAt: string;
}

export interface RetirementSearchRecommendation {
  id: string;
  identification: string;
  email: string;
  name: string;
  accountNonLocked: boolean;
  createdAt: string;
}

export interface UserProfileManagement {
  id: string;
  avatarImageName: string;
  description: string;
  displayFieldsConfig: DisplayPolicies;
  userSocialMedia: UserSocialMedia;
}
