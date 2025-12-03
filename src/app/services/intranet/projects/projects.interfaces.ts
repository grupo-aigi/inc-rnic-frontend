export interface ProjectCreateInfo {
  id?: string;
  generalTitle: string;
  missionsIds: number[];
  researchLineId: number;
  projectTypeId: number;
  generalDescription: {
    researcherName: string;
    researcherInstitution: string;
    researcherEmail: string;
    researcherPhone: string;
  };
  generalComponents: {
    problem: string;
    justification: string;
    researchQuestion: string;
    generalObjective: string;
    specificObjectives: string[];
    studyDesign: string;
    methodology: string;
    researchersAntecedents: string[];
    collaborationRequirements: string[];
  };
  responseCriteria: {
    orientedToDiscoveries: boolean;
    appropriateness: boolean;
    relevance: boolean;
    probabilityOfSuccess: boolean;
    replicableResults: boolean;
    impact: boolean;
  };
  createdAt?: Date;
}

export type ProjectInfo = Omit<
  ProjectCreateInfo,
  'missionsIds' | 'researchLineId' | 'projectTypeId'
> & {
  missions: { id: number; mission: ProjectMission }[];
  researchLine: { id: number; researchLine: ResearchLine };
  projectType: { id: number; projectType: string };
};

export interface ProjectFilterCriteria {
  busqueda?: string;
  linea?: ResearchLine;
}

export interface ProjectsSearchRecommendation {
  id: string;
  generalTitle: string;
  missionsIds: number[];
  researchLineId: number;
  projectTypeId: number;
}

export interface Mission {
  id: number;
  name: { en: string; es: string };
}

export interface ProjectType {
  id: number;
  name: { en: string; es: string };
}

export interface ProjectCriteria {
  id: number;
  name: { en: string; es: string };
}

export enum ProjectMission {
  MISSION_IN_2040_ELIMINATED_INEQUITIES = 'MISSION_IN_2040_ELIMINATED_INEQUITIES',
  MISSION_CHARACTERIZATION_OF_GENE_EXPRESSION = 'MISSION_CHARACTERIZATION_OF_GENE_EXPRESSION',
  MISSION_REDUCE_INCIDENCE_AND_OF_CANCER_IN_COLOMBIA = 'MISSION_REDUCE_INCIDENCE_AND_OF_CANCER_IN_COLOMBIA',
  MISSION_DEVELOP_AN_INTEGRATED_PLATFORM_FOR_RESEARCH = 'MISSION_DEVELOP_AN_INTEGRATED_PLATFORM_FOR_RESEARCH',
}

export enum ResearchLine {
  TODAS = '',
  BIOLOGIA_DEL_CANCER = 'BIOLOGIA_DEL_CANCER',
  DIAGNOSTICO_Y_TRATAMIENTO = 'DIAGNOSTICO_Y_TRATAMIENTO',
  PREVENCIÓN_PRIMARIA_Y_DETECCION_PRECOZ_DEL_CANCER = 'PREVENCIÓN_PRIMARIA_Y_DETECCION_PRECOZ_DEL_CANCER',
  ACTUAR_POLITICO_Y_CANCER = 'ACTUAR_POLITICO_Y_CANCER',
  DIVERSIDAD_Y_ETIOLOGIA_DEL_CINCER = 'DIVERSIDAD_Y_ETIOLOGIA_DEL_CINCER',
  SERVICIOS_Y_TECNOLOGIAS_PARA_LA_ATENCION_INTEGRAL_DEL_CANCER = 'SERVICIOS_Y_TECNOLOGIAS_PARA_LA_ATENCION_INTEGRAL_DEL_CANCER',
  ASPECTOS_PSICOSOCIALES_DEL_CANCER = 'ASPECTOS_PSICOSOCIALES_DEL_CANCER',
  EPIDEMIOLOGÍA_DESCRIPTIVA_Y_SISTEMA_DE_VIGILANCIA_DEL_CANCER = 'EPIDEMIOLOGÍA_DESCRIPTIVA_Y_SISTEMA_DE_VIGILANCIA_DEL_CANCER',
}

export const projectMissions = [
  {
    name: ProjectMission.MISSION_IN_2040_ELIMINATED_INEQUITIES,
    es: 'En 2040 Colombia habrá eliminado las inequidades en y entre los departamentos del territorio nacional en la mortalidad por todos los cánceres prevenibles, detectables y tratables.',
    en: 'In 2040 Colombia will have eliminated inequities in and between the departments of the national territory in mortality from all preventable, detectable and treatable cancers.',
  },
  {
    name: ProjectMission.MISSION_CHARACTERIZATION_OF_GENE_EXPRESSION,
    es: 'Caracterización de la expresión génica de lesiones premalignas en cáncer a través de secuenciación de nueva generación (NGS) con el fin de Identificar biomarcadores y blancos terapéuticos para el desarrollo y adaptación de opciones de tratamiento y difusión nivel poblacional a 2040. (Fases I, II, III y IV de la Medicina traslacional).',
    en: 'Characterization of gene expression of premalignant lesions in cancer through next-generation sequencing (NGS) in order to identify biomarkers and therapeutic targets for the development and adaptation of treatment options and dissemination at the population level by 2040 (Phases I, II, III and IV of translational medicine).',
  },

  {
    name: ProjectMission.MISSION_REDUCE_INCIDENCE_AND_OF_CANCER_IN_COLOMBIA,
    es: 'Disminuir en un 30% la incidencia y mortalidad de los 5 cánceres más incidentes en la población colombiana para el año 2040 mediante alianzas multidisciplinarias y colaborativas gubernamentales, departamentales y municipales.',
    en: 'Reduce by 30% the incidence and mortality of the 5 most incident cancers in the Colombian population by 2040 through multidisciplinary and collaborative governmental, departmental and municipal alliances.',
  },

  {
    name: ProjectMission.MISSION_DEVELOP_AN_INTEGRATED_PLATFORM_FOR_RESEARCH,
    es: 'Desarrollar una plataforma de datos integrados de cáncer que permita la generación de conocimiento y la toma de decisiones en salud pública, la investigación y la innovación en cáncer en Colombia a 2040.',
    en: 'Develop an integrated cancer data platform that allows the generation of knowledge and decision-making in public health, research and innovation in cancer in Colombia by 2040.',
  },
];

export const researchLines = [
  {
    name: ResearchLine.BIOLOGIA_DEL_CANCER,
    es: 'Biología del cáncer',
    en: 'Cancer biology',
  },
  {
    name: ResearchLine.DIAGNOSTICO_Y_TRATAMIENTO,
    es: 'Diagnóstico y tratamiento',
    en: 'Diagnosis and treatment',
  },
  {
    name: ResearchLine.PREVENCIÓN_PRIMARIA_Y_DETECCION_PRECOZ_DEL_CANCER,
    es: 'Prevención primaria y detección precoz del cáncer',
    en: 'Primary prevention and early detection of cancer',
  },
  {
    name: ResearchLine.ACTUAR_POLITICO_Y_CANCER,
    es: 'Actuar político y cáncer',
    en: 'Political action and cancer',
  },
  {
    name: ResearchLine.DIVERSIDAD_Y_ETIOLOGIA_DEL_CINCER,
    es: 'Diversidad y etiología del cáncer',
    en: 'Diversity and etiology of cancer',
  },
  {
    name: ResearchLine.SERVICIOS_Y_TECNOLOGIAS_PARA_LA_ATENCION_INTEGRAL_DEL_CANCER,
    es: 'Servicios y tecnologías para la atención integral del cáncer',
    en: 'Services and technologies for comprehensive cancer care',
  },
  {
    name: ResearchLine.ASPECTOS_PSICOSOCIALES_DEL_CANCER,
    es: 'Aspectos psicosociales del cáncer',
    en: 'Psychosocial aspects of cancer',
  },
  {
    name: ResearchLine.EPIDEMIOLOGÍA_DESCRIPTIVA_Y_SISTEMA_DE_VIGILANCIA_DEL_CANCER,
    es: 'Epidemiología descriptiva y sistema de vigilancia del cáncer',
    en: 'Descriptive epidemiology and cancer surveillance system',
  },
];
