import { Commissions } from '../intranet/commissions/commissions.interfaces';
import { Role } from '../intranet/user/user.interfaces';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokenPayload {
  id: string;
  email: string;
  roles: string[];
}

export interface RegisterResponse {
  ok: boolean;
  message: string;
}

export interface BasicUserInfo {
  name: string;
}

export interface LoginResponse {
  accessToken: string;
  idToken: string;
}

export interface RegisterCredentials {
  email: string;
  identification: string;
  name: string;
  phoneNumber: string;
  commissions: Commissions[];
}

export type RegisterCredentialsFromIntranet = RegisterCredentials & {
  entryDate: Date;
};

export interface ChangePasswordInfo {
  email: string;
  currentPassword: string;
  newPassword: string;
}

export interface IdTokenPayload {
  sub: string;
  changed_pass: boolean;
  roles: LabeledRole[];
  created_at: Date;
  description: string;
  orcid: string;
  linkedin: string;
  scopus: string;
  uuid: string;
  displayPolicies: DisplayPolicies;
  identification: number;
  phoneNumber: string;
  commissions: string[];
  name: string;
  iat: number;
  exp: number;
}

export interface AccessTokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

export interface DisplayPolicies {
  showEmail: boolean;
  showPhone: boolean;
  showDescription: boolean;
  showIdentification: boolean;
  showCommissions: boolean;
  showLinkedin: boolean;
  showOrcid: boolean;
  showScopus: boolean;
}

export interface LabeledRole {
  role: Role;
  en: string;
  priority: string;
  es: string;
}

export interface UserRegister {
  id: string;
  userInfo?: RegisterCredentialsFromIntranet;
  file: File;
  valid?: boolean;
  completed?: boolean;
}

export interface UserInputInfo {
  email: string;
  identification: string;
  fullName: string;
  phoneNumber: string;
  committees: string[];
  entryDate: Date;
}
