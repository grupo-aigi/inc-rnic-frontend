import { NetworkGroups } from '../../shared/groups/groups.interfaces';

export interface CommissionMonthlyMembers {
  month: number;
  usersInfo: { id: string; name: string; browserUrl?: string }[];
}

export interface CommissionDetail {
  id: number;
  label: { es: string; en: string };
  value: Commissions;
  logo: { label: string; color: string };
}

export enum Commissions {
  TODAS_LAS_COMISIONES = 'TODAS_LAS_COMISIONES',
  COMISION_DISENO_MISION_CANCER = 'COMISION_DISENO_MISION_CANCER',
  COMISION_FORMULACION_PROYECTOS = 'COMISION_FORMULACION_PROYECTOS',
  COMISION_ORGANIZACION_EVENTOS = 'COMISION_ORGANIZACION_EVENTOS',
}

export interface CommissionInformation {
  name: Commissions;
  topTitle: { es: string; en: string };
  title: { es: string; en: string };
  lastEdit: string;
  description: { es: string; en: string };
  contactUs: { es: string; en: string };
  email: string;
  representativesTitle: { en: string; es: string };
  representatives: { name: string; occupation: { es: string; en: string } }[];
  facilitatorsTitle: { en: string; es: string };
  facilitators: { name: string; occupation: { es: string; en: string } }[];
  enumMainActivities: boolean;
  mainActivitiesTitle: { es: string; en: string };
  mainActivities: { es: string; en: string }[];
  closeBtn: { es: string; en: string };
}
