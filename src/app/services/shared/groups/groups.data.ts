import { Role } from '../../intranet/user/user.interfaces';
import { NetworkGroupDetail, NetworkGroups } from './groups.interfaces';

export const networkGroups: NetworkGroupDetail[] = [
  {
    id: 1,
    label: { es: 'Grupo Coordinador', en: 'Coordinating Group' },
    value: NetworkGroups.COORDINATING,
    role: Role.ROLE_COORDINATOR,
  },
  {
    id: 2,
    label: { es: 'Grupo Facilitador', en: 'Facilitating Group' },
    value: NetworkGroups.FACILITATING,
    role: Role.ROLE_FACILITATOR,
  },
];
