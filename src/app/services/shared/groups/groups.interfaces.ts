import { Role } from '../../intranet/user/user.interfaces';
import { AppLanguage, AppLocale } from '../lang/lang.interfaces';

export enum NetworkGroups {
  COORDINATING = 'COORDINADOR',
  FACILITATING = 'FACILITADOR',
}

export interface NetworkGroupDetail {
  id: number;
  label: AppLocale;
  value: NetworkGroups;
  role: Role;
}
