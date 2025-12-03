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
    es: 'Principal',
    en: 'Main',
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
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, sampleTime } from 'rxjs';

import { LangService } from '../../../../services/shared/lang/lang.service';

@Component({
  standalone: true,
  selector: 'app-scientific-ecosystem-page',
  templateUrl: './scientific-ecosystem-page.component.html',
  styleUrls: ['./scientific-ecosystem-page.component.scss'],
  imports: [CommonModule, RouterModule],
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
