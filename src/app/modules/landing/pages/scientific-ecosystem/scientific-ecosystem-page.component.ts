import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ScientificEcosystemStateService } from '../../../../services/landing/scientific-ecosystem/scientific-ecosystem-state.service';
import {
  ALL_SCIENTIFIC_ECOSYSTEM_SECTIONS,
  SCIENTIFIC_ECOSYSTEM_SECTIONS_MAP,
  ScientificEcosystemData,
  ScientificEcosystemDetailResourceType,
  ScientificEcosystemDetailType,
} from '../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { LangService } from '../../../../services/shared/lang/lang.service';
import { ScientificEcosystemSectionComponent } from './components/scientific-ecosystem-section/scientific-ecosystem-section.component';
import { ScientificEcosystemSidebarComponent } from './components/scientific-ecosystem-sidebar/scientific-ecosystem-sidebar.component';
import labels from './scientific-ecosystem.lang';

const sampleEcosystemData: ScientificEcosystemData = {
  id: 1,
  title: 'Cáncer Colorrecal',
  urlName: 'cancer-colorrectal',
  sections: [
    {
      TYPE: 'NOSOTROS',
      description: [
        'El cáncer colorrectal (CCR) es una de las neoplasias malignas más comunes en todo el mundo y una de las principales causas de muerte por cáncer. En los últimos años, la incidencia y mortalidad del CCR han aumentado significativamente en muchos países, lo que subraya la importancia de abordar este problema de salud pública de manera integral.',
      ],
    },
    {
      TYPE: 'OBJ_GENERAL',
      generalObjective:
        'El objetivo general de este ecosistema científico es fomentar la colaboración interdisciplinaria entre investigadores, profesionales de la salud, pacientes y otras partes interesadas para avanzar en la comprensión, prevención, diagnóstico y tratamiento del cáncer colorrectal.',
    },
    {
      TYPE: 'OBJ_ESPECIFICOS',
      specificObjectives: [
        'Promover la investigación básica y clínica sobre los mecanismos moleculares y genéticos del CCR.',
        'Desarrollar y validar nuevas estrategias de detección temprana y diagnóstico del CCR.',
        'Mejorar las opciones de tratamiento y manejo del CCR a través de ensayos clínicos y estudios observacionales.',
        'Fomentar la educación y concienciación sobre el CCR entre la población general y los profesionales de la salud.',
        'Facilitar la creación de redes de colaboración entre instituciones académicas, centros de investigación, hospitales y organizaciones de pacientes.',
      ],
    },
    {
      TYPE: 'HOJA_RUTA',
      resources: [
        {
          filename: 'some-file-name.pdf',
          filetype: 'PDF',
          originalFilename: 'some-file-name.pdf',
          size: 300000,
        },
        {
          filename: 'some-file-name2.pdf',
          filetype: 'PDF',
          originalFilename: 'some-file-name2.pdf',
          size: 500000,
        },
      ],
    },
    {
      TYPE: 'LINEAMIENTOS',
      resources: [
        {
          filename: 'some-file-name.pdf',
          filetype: 'PDF',
          originalFilename: 'some-file-name.pdf',
          size: 300000,
        },
        {
          filename: 'some-file-name2.pdf',
          filetype: 'PDF',
          originalFilename: 'some-file-name2.pdf',
          size: 500000,
        },
      ],
    },
    {
      TYPE: 'INTEGRANTES',
      title: 'Miembros del ecosistema',
      paragraphs: [
        'A continuación, se presentan los miembros de este ecosistema',
      ],
      images: [],
    },
    {
      TYPE: 'PROYECTOS',
      projects: [
        {
          name: 'Proyecto 1',
          author: 'Nombre del autor',
          objectives: ['Objectivo 1', 'Objectivo 2'],
        },
        {
          name: 'Proyecto 2',
          author: 'Nombre del autor',
          objectives: ['Objectivo 3', 'Objectivo 4'],
        },
        {
          name: 'Proyecto 3',
          author: 'Nombre del autor',
          objectives: ['Objectivo 4', 'Objectivo 5'],
        },
      ],
    },
    {
      TYPE: 'CONTACTO',
      contacts: [
        {
          name: 'Pedro Pérez',
          role: 'Administrador',
          email: 'pedro.perez@gmail.com',
        },
        {
          name: 'Marina Pérez',
          role: 'Investigadora',
          email: 'marina.perez@gmail.com',
        },
        {
          name: 'Mario Pérez',
          role: 'Coordinador general',
          email: 'mario.perez@gmail.com',
        },
      ],
    },
  ],
};

@Component({
  standalone: true,
  selector: 'app-scientific-ecosystem-page',
  templateUrl: './scientific-ecosystem-page.component.html',
  styleUrls: ['./scientific-ecosystem-page.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    ScientificEcosystemSidebarComponent,
    ScientificEcosystemSectionComponent,
  ],
})
export class ScientificEcosystemPage implements OnInit, OnDestroy {
  public ecosystemData: ScientificEcosystemData = sampleEcosystemData;
  public isLoading = true;
  public hasError = false;
  public activeSections: ScientificEcosystemDetailResourceType[] = [];

  public ALL_SECTIONS = ALL_SCIENTIFIC_ECOSYSTEM_SECTIONS;
  public SECTIONS_MAP = SCIENTIFIC_ECOSYSTEM_SECTIONS_MAP;

  private destroy$ = new Subject<void>();

  public constructor(
    private title: Title,
    private langService: LangService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private stateService: ScientificEcosystemStateService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);

    // Suscribirse a cambios de idioma
    this.langService.language$
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.title.setTitle(labels.pageTitle[lang]);
      });

    // Suscribirse a cambios de secciones activas desde el servicio
    this.stateService.activeSections$
      .pipe(takeUntil(this.destroy$))
      .subscribe((sections) => {
        this.activeSections = sections;
      });

    // Sincronizar con query params al iniciar
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params['sections']) {
          const sectionsFromUrl = params['sections'].split(
            ',',
          ) as ScientificEcosystemDetailResourceType[];
          this.stateService.setActiveSections(sectionsFromUrl);
        }
      });

    this.loadEcosystemData();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  public handleToggleSection(
    sectionType: ScientificEcosystemDetailResourceType,
  ): void {
    this.stateService.toggleSection(sectionType);
    this.updateQueryParams();
  }

  public expandAll(): void {
    this.stateService.expandAll(this.ALL_SECTIONS);
    this.updateQueryParams();
  }

  public collapseAll(): void {
    this.stateService.collapseAll();
    this.updateQueryParams();
  }

  private updateQueryParams(): void {
    const activeSections = this.stateService.getActiveSections();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sections: activeSections.length > 0 ? activeSections.join(',') : null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  public getSectionDetailType(
    type: ScientificEcosystemDetailResourceType,
  ): ScientificEcosystemDetailType {
    return this.ecosystemData.sections.find(
      (section) => section.TYPE === type,
    )!;
  }

  public scrollToSection(
    sectionType: ScientificEcosystemDetailResourceType,
  ): void {
    // Abrir la sección si no está abierta
    if (!this.activeSections.includes(sectionType)) {
      this.handleToggleSection(sectionType);
    }
    // Esperar un momento para que se renderice la sección
    setTimeout(() => {
      const element = document.getElementById(sectionType);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}
