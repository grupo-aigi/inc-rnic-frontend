const sampleEcosystemData: ScientificEcosystemData = {
  mainTitle: 'Ecosistema científico en alianza para la investigación...',
  mainSubtitle: 'Características esenciales del ecosistema científico para CCR',
  essentialCharacteristics: {
    title: 'Características esenciales del ecosistema científico para CCR',
    items: [
      'Defensa del papel clave del estado...',
      'Énfasis en el cambio de la direccionalidad...',
      'Coordinación en la formulación...',
      'Capacidad para acceder o movilizar...',
    ],
  },
  generalObjective: {
    title: 'Objetivo general',
    description:
      'Desarrollar un ecosistema científico para el control del CCR...',
  },
  specificObjectives: {
    title: 'Objetivos específicos',
    items: [
      'Monitorizar la conexión y la coordinación...',
      'Consolidar la comunicación e información...',
      'Promover el aprendizaje y la capacidad reflexiva...',
      'Contribuir con la formulación de políticas públicas...',
      'Contribuir con la generación de competencias técnicas...',
    ],
  },
  challengesAndMissions: {
    title:
      'Desafíos y misiones para el control integral del cáncer colorrectal',
    mainChallenge: {
      title: 'Desafío',
      description: 'Ecosistema científico para la investigación...',
    },
    intermediateMissions: {
      title: 'Misiones Intermedias',
      items: [
        {
          title: 'Reducción de incidencia de cáncer colorrectal en Colombia',
        },
        {
          title: 'Identificación de biomarcadores...',
        },
      ],
    },
    initialMissions: {
      title: 'Misiones Iniciales',
      items: [
        {
          title: 'Reducción de mortalidad de cáncer colorrectal en Colombia',
        },
        {
          title: 'Programa para tamización y detección temprana...',
        },
      ],
    },
  },
  footer: {
    thankYouMessage: 'Gracias por su atención',
    websiteUrl: 'www.cancer.gov.co',
  },
  sections: [
    {
      id: '1',
      title: { es: 'Nosotros', en: 'About us' },
      content: { es: 'Contenido de la sección 1', en: 'Content of section 1' },
    },
    {
      id: '2',
      title: { es: 'Objetivo General', en: 'General Objective' },
      content: { es: 'Contenido de la sección 2', en: 'Content of section 2' },
    },
    {
      id: '3',
      title: { es: 'Objetivos Específicos', en: 'Specific Objectives' },
      content: { es: 'Contenido de la sección 3', en: 'Content of section 3' },
    },
    {
      id: '4',
      title: { es: 'Hoja de Ruta', en: 'Roadmap' },
      content: { es: 'Contenido de la sección 4', en: 'Content of section 4' },
    },
    {
      id: '5',
      title: { es: 'Lineamientos', en: 'Guidelines' },
      content: { es: 'Contenido de la sección 5', en: 'Content of section 5' },
    },
    {
      id: '6',
      title: { es: 'Cómo participar', en: 'How to Participate' },
      content: { es: 'Contenido de la sección 6', en: 'Content of section 6' },
    },
    {
      id: '7',
      title: { es: 'Integrantes', en: 'Members' },
      content: { es: 'Contenido de la sección 7', en: 'Content of section 7' },
    },
    {
      id: '8',
      title: { es: 'Proyectos', en: 'Projects' },
      content: { es: 'Contenido de la sección 8', en: 'Content of section 8' },
    },
    {
      id: '9',
      title: { es: 'Eventos', en: 'Events' },
      content: { es: 'Contenido de la sección 9', en: 'Content of section 9' },
    },
    {
      id: '10',
      title: { es: 'Contacto', en: 'Contact' },
      content: {
        es: 'Contenido de la sección 10',
        en: 'Content of section 10',
      },
    },
  ],
};

export interface ScientificEcosystemData {
  mainTitle: string;
  mainSubtitle: string;
  essentialCharacteristics: {
    title: string;
    items: string[];
  };
  generalObjective: {
    title: string;
    description: string;
  };
  specificObjectives: {
    title: string;
    items: string[];
  };
  challengesAndMissions: {
    title: string;
    mainChallenge: {
      title: string;
      description: string;
    };
    intermediateMissions: {
      title: string;
      items: MissionItem[];
    };
    initialMissions: {
      title: string;
      items: MissionItem[];
    };
  };
  footer: {
    thankYouMessage: string;
    websiteUrl: string;
  };
  sections: ScientificEcosystemSection[];
}

export interface MissionItem {
  title: string;
  description?: string;
}

// scientific-ecosystem.lang.ts
const labels = {
  pageTitle: {
    en: 'Scientific Ecosystem | National Cancer Research Network',
    es: 'Ecosistema Científico | Red Nacional de Investigación en Cáncer',
  },
  title: {
    en: 'Scientific Ecosystem',
    es: 'Ecosistema Científico',
  },
  main: {
    es: 'Inicio',
    en: 'Home',
  },
  ecosystem: {
    es: 'Ecosistema',
    en: 'Ecosystem',
  },
  loading: {
    en: 'Loading...',
    es: 'Cargando...',
  },
  error: {
    en: 'Error loading content',
    es: 'Error al cargar el contenido',
  },
};

export default labels;

// scientific-ecosystem-page.component.ts
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { LangService } from '../../../../services/shared/lang/lang.service';
import { ScientificEcosystemSectionsComponent } from './components/scientific-ecosystem-sections/scientific-ecosystem-sections.component';
import { ScientificEcosystemSidebarComponent } from './components/scientific-ecosystem-sidebar/scientific-ecosystem-sidebar.component';
import { ScientificEcosystemSection } from '../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';

@Component({
  standalone: true,
  selector: 'app-scientific-ecosystem-page',
  templateUrl: './scientific-ecosystem-page.component.html',
  styleUrls: ['./scientific-ecosystem-page.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    ScientificEcosystemSidebarComponent,
    ScientificEcosystemSectionsComponent,
  ],
})
export class ScientificEcosystemPage implements OnInit {
  public ecosystemData: ScientificEcosystemData = sampleEcosystemData;
  public isLoading = true;
  public hasError = false;

  public constructor(
    private title: Title,
    private langService: LangService,
    private http: HttpClient,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
      this.loadEcosystemData();
    });
    this.loadEcosystemData();
  }

  private async loadEcosystemData() {
    this.isLoading = true;
    this.hasError = false;
    // Simulate loading
    setTimeout(() => {
      this.ecosystemData = sampleEcosystemData;
      this.isLoading = false;
    }, 1000);
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }
}
