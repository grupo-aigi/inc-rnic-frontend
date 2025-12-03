import { LabeledRole } from '../../auth/auth.interfaces';
import { Commissions } from '../commissions/commissions.interfaces';

export enum Role {
  ALL_ROLES = 'ALL_ROLES',
  ROLE_SUPER_ADMIN = 'ROLE_SUPER_ADMIN',
  ROLE_OPERATIONAL_COORDINATOR = 'ROLE_OPERATIONAL_COORDINATOR',
  ROLE_REGISTERED = 'ROLE_REGISTERED',
  ROLE_LINKED = 'ROLE_LINKED',
  ROLE_COORDINATOR = 'ROLE_COORDINATOR',
  ROLE_FACILITATOR = 'ROLE_FACILITATOR',
}

export interface UserInfo {
  id: string;
  email: string;
  identification: string;
  name: string;
  phoneNumber: string;
  description: string;
  createdAt: Date;
  roles: LabeledRole[];
  changedPass: boolean;
  orcid: string;
  linkedin: string;
  scopus: string;
  commissions: Commissions[];
  displayPolicies: DisplayInfoPolicies;
}

export interface DisplayInfoPolicies {
  showEmail: boolean;
  showOrcid: boolean;
  showPhone: boolean;
  showScopus: boolean;
  showLinkedin: boolean;
  showDescription: boolean;
  showIdentification: boolean;
  showCommissions: boolean;
}

export interface UsersSearchRecommendation {
  id: string;
  identification: number;
  email: string;
  name: string;
  active: boolean;
  image?: string;
}

export interface UsersFilterCriteria {
  search: string;
  role: Role;
  commission: Commissions;
}

export interface UserManagement {
  id: string;
  identification: number;
  email: string;
  name: string;
  phoneNumber: string;
  changedPassFirstTime: boolean;
  createdAt: Date;
  commissions: Commissions[];
  grantedAuthorities: { authority: Role }[];
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
  username: string;
  enabled: boolean;
  active: boolean;
  blockedStatus: {
    until?: Date;
    blockedAt: Date;
  } | null;
}

export interface InputUserInfo {
  email: string;
  name: string;
  identification: string;
  phoneNumber: string;
  committee: string;
}

export interface DisableAccountInfo {
  userId: string;
  disableType: 'TEMPORAL' | 'DEFINITIVO';
  reason: string;
}
