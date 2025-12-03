import { CommissionDetail, Commissions } from './commissions.interfaces';

export const commissions: CommissionDetail[] = [
  {
    id: 0,
    label: {
      es: 'Comisión para el diseño y formulación de la misión control del  cáncer',
      en: 'Commission for the design and formulation of the cancer control mission',
    },
    value: Commissions.COMISION_DISENO_MISION_CANCER,
    logo: { label: 'MC', color: '#FF9800' },
  },
  {
    id: 1,
    label: {
      es: 'Comisión para la formulación de proyectos',
      en: 'Commission for the formulation of projects',
    },
    value: Commissions.COMISION_FORMULACION_PROYECTOS,
    logo: { label: 'FP', color: '#588157' },
  },
  {
    id: 2,
    label: {
      en: 'Commission for the organization of scientific and academic events',
      es: 'Comisión de organización de eventos científicos y académicos',
    },
    value: Commissions.COMISION_ORGANIZACION_EVENTOS,
    logo: { label: 'OE', color: '#FF5722' },
  },
  {
    id: 3,
    label: {
      es: 'Todas las comisiones',
      en: 'All commissions',
    },
    value: Commissions.TODAS_LAS_COMISIONES,
    logo: { label: 'TC', color: '#FF5722' },
  },
];

export default commissions;
