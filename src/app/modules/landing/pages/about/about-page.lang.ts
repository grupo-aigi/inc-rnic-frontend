import { Commissions } from '../../../../services/intranet/commissions/commissions.interfaces';

const labels = {
  pageTitle: {
    es: 'Acerca de | Red Nacional de Investigación en Cáncer',
    en: 'About | National Cancer Research Network',
  },
  about: {
    en: 'About',
    es: 'Acerca de',
  },
  main: {
    en: 'Main',
    es: 'Principal',
  },
  aboutRNIC: {
    es: 'SOBRE LA RED NACIONAL DE INVESTIGACIÓN EN CÁNCER',
    en: 'ABOUT THE NATIONAL CANCER RESEARCH NETWORK',
    whoAreWe: {
      es: '¿Quiénes somos?',
      en: 'Who are we?',
    },
    description: {
      es: 'La Red Nacional de Investigación en Cáncer busca fortalecer la investigación, el desarrollo experimental y la innovación (I+D+i) en el campo de la oncología, a través de la gestión del conocimiento que contribuya al control del cáncer en Colombia, promoviendo la articulación de diferentes actores. Para dicho propósito; se formula como una de las actividades contenidas en el Artículo 12 de la Ley Sandra Ceballos, que define los mecanismos y la organización de la Red Nacional de Cáncer.',
      en: 'The National Cancer Research Network seeks to strengthen research, experimental development and innovation (R&D&i) in the field of oncology, through knowledge management that contributes to cancer control in Colombia, promoting the articulation of different actors. For this purpose; it is formulated as one of the activities contained in Article 12 of the Sandra Ceballos Law, which defines the mechanisms and organization of the National Cancer Network.',
    },
  },
  generalObjective: {
    title: {
      es: 'Objetivo general de la Red',
      en: 'General objective of the Network',
    },
    description: {
      es: 'Crear un entorno que promueva la integración, el trabajo colaborativo y transdisciplinar, que dé soporte a la gestión del conocimiento en cáncer en Colombia, en el marco de la investigación orientada por misiones.',
      en: 'Create an environment that promotes integration, collaborative and transdisciplinary work, which supports knowledge management in cancer in Colombia, within the framework of mission-oriented research.',
    },
  },
  specificObjectives: {
    title: {
      es: 'Objetivos específicos',
      en: 'Specific objectives',
    },
    item1: {
      es: 'Participar en la definición de misiones relacionadas con el desafío del control del cáncer en Colombia.',
      en: 'Participate in the definition of missions related to the challenge of cancer control in Colombia.',
    },
    item2: {
      es: 'Articular a las redes en oncología existentes en el ámbito nacional, de tal manera que facilite su contribución a la formulación y ejecución de planes nacionales para el control del cáncer en Colombia.',
      en: 'Articulate the existing oncology networks at the national level, in such a way that it facilitates their contribution to the formulation and execution of national plans for cancer control in Colombia.',
    },
    item3: {
      es: 'Desarrollar proyectos y programas de I+D+i, orientados a resolver las necesidades priorizadas por la Red para el país.',
      en: 'Develop R&D&i projects and programs, aimed at solving the needs prioritized by the Network for the country.',
    },
    item4: {
      es: 'Incrementar las opciones y probabilidades de financiamiento de protocolos de investigación generados o desarrollados al interior de la red.',
      en: 'Increase the options and probabilities of financing research protocols generated or developed within the network.',
    },
    item5: {
      es: 'Promover la realización de actividades que contribuyan a la divulgación en diferentes ambientes y escenarios de los resultados de investigación de la Red.',
      en: 'Promote the realization of activities that contribute to the dissemination in different environments and scenarios of the research results of the Network.',
    },
    item6: {
      es: 'Liderar las acciones necesarias para una adecuada gestión del conocimiento que promueva su apropiación social contribuyendo al control integral del cáncer.',
      en: 'Lead the necessary actions for an adequate knowledge management that promotes its social appropriation contributing to the integral control of cancer.',
    },
    item7: {
      es: 'Realizar actividades de educación y capacitación continuas en investigación, desarrollo experimental e innovación, que promuevan el fortalecimiento de las competencias de los investigadores de la Red.',
      en: 'Carry out continuous education and training activities in research, experimental development and innovation, which promote the strengthening of the competencies of the researchers of the Network.',
    },
  },
  workTeam: {
    title: {
      es: 'Equipo de Trabajo',
      en: 'Work Team',
    },
    subtitle: {
      es: 'Mecanismo de Coordinación de la Red Nacional de Investigación en Cáncer',
      en: 'Coordination Mechanism of the National Cancer Research Network',
    },
  },
  coordinatorFunctions: {
    title: {
      es: 'Funciones del grupo Coordinador de la Red',
      en: 'Functions of the Network Coordinator group',
    },
    item1: {
      es: 'Definir y actualizar los mecanismos propios de operación del Grupo coordinador, como la periodicidad de sus reuniones, la toma de decisiones y los requerimientos administrativos y logísticos para su adecuado funcionamiento.',
      en: 'Define and update the mechanisms of operation of the Coordinator Group, such as the periodicity of its meetings, decision-making and the administrative and logistical requirements for its proper functioning.',
    },
    item2: {
      es: 'Velar por el cumplimiento de los lineamientos de la Red.',
      en: 'Ensure compliance with the guidelines of the Network.',
    },
    item3: {
      es: 'Definir estrategias de comunicación de la Red.',
      en: 'Define the Network communication strategies.',
    },
    item4: {
      es: 'Servir de vocero de los involucrados en la Red, ante personas y entidades externas, cuando dicha función sea necesaria.',
      en: 'Serve as a spokesperson for those involved in the Network, before external people and entities, when such a function is necessary.',
    },
    item5: {
      es: 'Aprobar los planes de trabajo presentados por cada comisión de la Red.',
      en: 'Approve the work plans presented by each commission of the Network.',
    },
    item6: {
      es: 'Revisar y aprobar los informes semestrales de las comisiones de la Red en cuanto a su labor técnico-científica y manejo administrativo.',
      en: "Review and approve the semi-annual reports of the Network's commissions regarding their technical-scientific work and administrative management.",
    },
    item7: {
      es: 'Gestionar recursos para la realización de actividades contando con la concurrencia de los integrantes de acuerdo con sus capacidades y recursos.',
      en: 'Manage resources for the realization of activities, counting on the concurrence of the members according to their capacities and resources.',
    },
    item8: {
      es: 'Consolidar y presentar informes anuales de la operación de la Red.',
      en: 'Consolidate and present annual reports on the operation of the Network.',
    },
    item9: {
      es: 'Aprobar el ingreso de nuevos miembros de la Red Nacional de Investigación en Cáncer, previa verificación de cumplimiento de requisitos y evaluación de inhabilidades o impedimentos.',
      en: 'Approve the entry of new members of the National Cancer Research Network, after verifying compliance with requirements and evaluating disqualifications or impediments.',
    },
    item10: {
      es: 'Definir los mecanismos que garanticen transparencia y manejo de conflictos de intereses de los participantes de la Red, así como los aspectos que garanticen la independencia técnica de la red con relación a las potenciales fuentes de financiación pública o privada.',
      en: 'Define the mechanisms that guarantee transparency and management of conflicts of interest of the participants of the Network, as well as the aspects that guarantee the technical independence of the network in relation to potential sources of public or private financing.',
    },
    item11: {
      es: 'Evaluar los potenciales conflictos de interés, inhabilidades o impedimentos de miembros de la Red para participar en actividades específicas de las comisiones de trabajo.',
      en: 'Evaluate the potential conflicts of interest, disqualifications or impediments of members of the Network to participate in specific activities of the work commissions.',
    },
    item12: {
      es: 'Seleccionar los proyectos para su financiación y ejecución de acuerdo con los recursos disponibles.',
      en: 'Select the projects for their financing and execution according to the available resources.',
    },
  },
  workingCommittees: {
    title: {
      es: 'Comisiones de Trabajo de La Red',
      en: 'Working Committees of the Network',
    },
    item1: {
      commission: Commissions.COMISION_DISENO_MISION_CANCER,
      title: {
        es: 'Comisión para el diseño y formulación de la misión control del cáncer',
        en: 'Commission for the design and formulation of the cancer control mission',
      },
      description: {
        es: 'Promover y defender la postulación de una eventual misión de control de cáncer que se incorpore en los planes integrales para el control del cáncer en Colombia.',
        en: 'Promote and defend the nomination of an eventual cancer control mission that is incorporated into the comprehensive plans for cancer control in Colombia.',
      },
      moreInfo: {
        es: 'Más información',
        en: 'More information',
      },
    },
    item2: {
      commission: Commissions.COMISION_FORMULACION_PROYECTOS,
      title: {
        es: 'Comisión para la formulación de proyectos',
        en: 'Commission for the formulation of projects',
      },
      description: {
        es: 'Coordinar la generación de perfiles de idea o proyectos de investigación con carácter colaborativo, inter y transdisciplinario, entre los investigadores de la Red, orientados a la solución de problemas en el ámbito nacional.',
        en: 'Coordinate the generation of idea profiles or research projects with a collaborative, inter and transdisciplinary nature, among the researchers of the Network, aimed at solving problems at the national level.',
      },
      moreInfo: {
        es: 'Más información',
        en: 'More information',
      },
    },
    item3: {
      commission: Commissions.COMISION_ORGANIZACION_EVENTOS,
      title: {
        es: 'Comisión de organización de eventos científicos y académicos',
        en: 'Commission for the organization of scientific and academic events',
      },
      description: {
        es: 'Promover la interacción entre los miembros de la Red, a través de la realización de eventos científicos y académicos que permitan la divulgación del conocimiento en cáncer.',
        en: 'Promote interaction among the members of the Network, through the holding of scientific and academic events that allow the dissemination of knowledge in cancer.',
      },
      moreInfo: {
        es: 'Más información',
        en: 'More information',
      },
    },
  },
};

export default labels;
