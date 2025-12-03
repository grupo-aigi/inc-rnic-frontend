import { Role } from './user.interfaces';

export const roles = [
  {
    label: {
      es: 'Todos los roles',
      en: 'All roles',
    },
    value: Role.ALL_ROLES,
  },
  {
    label: {
      es: 'Administrador',
      en: 'Administrator',
    },
    value: Role.ROLE_SUPER_ADMIN,
  },
  {
    label: {
      es: 'Vinculado',
      en: 'Linked',
    },
    value: Role.ROLE_LINKED,
  },
  {
    label: {
      es: 'Inscrito',
      en: 'Registered',
    },
    value: Role.ROLE_REGISTERED,
  },
  {
    label: {
      es: 'Miembro de Grupo Coordinador',
      en: 'Coordinator Group Member',
    },
    value: Role.ROLE_COORDINATOR,
  },
  {
    label: {
      es: 'Miembro de Grupo Facilitador',
      en: 'Facilitator Group Member',
    },
    value: Role.ROLE_FACILITATOR,
  },
  {
    label: {
      es: 'Coordinador Operativo',
      en: 'Operational Coordinator',
    },
    value: Role.ROLE_OPERATIONAL_COORDINATOR,
  },
];
