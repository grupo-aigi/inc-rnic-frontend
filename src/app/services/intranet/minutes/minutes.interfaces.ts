import { NetworkGroups } from '../../shared/groups/groups.interfaces';
import { Commissions } from '../commissions/commissions.interfaces';
import { Role, UserInfo } from '../user/user.interfaces';

export interface CommissionMinuteInfo {
  id: string;
  name: string;
  start: Date;
  end: Date;
  subject: string;
  place: string;
  commission: { id: number; networkCommission: Commissions };
  confirmation?: MinuteConfirmation;

  attendance?: MinuteAttendance;
  createdAt?: Date;
  author?: { id: string; name: string };
}

export interface GroupMinuteInfo {
  id: string;
  name: string;
  start: Date;
  end: Date;
  subject: string;
  place: string;
  group: NetworkGroups;
  confirmation?: MinuteConfirmation;
  attendance?: MinuteAttendance;
  createdAt?: Date;
  author?: UserInfo;
}

export interface MinuteConfirmation {
  count: number;
  items: MinuteApproval[];
}

export interface MinuteApproval {
  id: number;
  approver: { id: string; name: string };
  browserUrl?: string;
  confirmedAt: Date;
}

export interface MinuteAttendance {
  count: number;
  items: MinuteAssistant[];
}

export interface MinuteAssistant {
  id: string;
  assistant: { id: string; name: string };
  attended: boolean;
  browserUrl?: string;
}

export interface CommissionMinutesFilterCriteria {
  busqueda?: string;
  comision?: Commissions;
  desde?: Date;
  hasta?: Date;
}

export interface GroupMinutesFilterCriteria {
  busqueda?: string;
  grupo?: NetworkGroups;
  desde?: Date;
  hasta?: Date;
}

export interface CoordinatingGroupMinuteInfo {
  id: string;
  name: string;
  start: Date;
  end: Date;
  subject: string;
  place: string;
  confirmation?: {
    count: number;
    list: { id: string; userId: string; confirmedAt: Date }[];
  };
  attendance?: {
    count: number;
    list: { id: string; userId: string }[];
  };
  createdAt?: Date;
  createdBy?: string;
}

export interface CommissionMinuteSearchRecommendation {
  id: string;
  title: string;
  meetingDate: Date;
  commission: Commissions;
}

export interface GroupMinuteSearchRecommendation {
  id: string;
  title: string;
  meetingDate: Date;
  group: NetworkGroups;
}

export interface MinutesResponse<T> {
  total: number;
  items: T[];
}
