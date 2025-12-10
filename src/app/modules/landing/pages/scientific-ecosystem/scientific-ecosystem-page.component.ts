const sampleEcosystemData: ScientificEcosystemData = {
  id: 1,
  title: 'Cáncer Colorrecal',
  urlName: 'cancer-colorrectal',
  sections: [
    {
      TYPE: 'SCIENTIFIC_ECOSYSTEM__ABOUT_US',
      description: [
        'El cáncer colorrectal (CCR) es una de las neoplasias malignas más comunes en todo el mundo y una de las principales causas de muerte por cáncer. En los últimos años, la incidencia y mortalidad del CCR han aumentado significativamente en muchos países, lo que subraya la importancia de abordar este problema de salud pública de manera integral.',
      ],
    },
    {
      TYPE: 'SCIENTIFIC_ECOSYSTEM__GENERAL_OBJECTIVE',
      generalObjective:
        'El objetivo general de este ecosistema científico es fomentar la colaboración interdisciplinaria entre investigadores, profesionales de la salud, pacientes y otras partes interesadas para avanzar en la comprensión, prevención, diagnóstico y tratamiento del cáncer colorrectal.',
    },
    {
      TYPE: 'SCIENTIFIC_ECOSYSTEM__SPECIFIC_OBJECTIVES',
      specificObjectives: [
        'Promover la investigación básica y clínica sobre los mecanismos moleculares y genéticos del CCR.',
        'Desarrollar y validar nuevas estrategias de detección temprana y diagnóstico del CCR.',
        'Mejorar las opciones de tratamiento y manejo del CCR a través de ensayos clínicos y estudios observacionales.',
        'Fomentar la educación y concienciación sobre el CCR entre la población general y los profesionales de la salud.',
        'Facilitar la creación de redes de colaboración entre instituciones académicas, centros de investigación, hospitales y organizaciones de pacientes.',
      ],
    },
    {
      TYPE: 'SCIENTIFIC_ECOSYSTEM__ROADMAP',
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
      TYPE: 'SCIENTIFIC_ECOSYSTEM__GUIDELINES',
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
      TYPE: 'SCIENTIFIC_ECOSYSTEM__MEMBERS',
      title: 'Miembros del ecosistema',
      paragraphs: [
        'A continuación, se presentan los miembros de este ecosistema',
      ],
      images: [],
    },
    {
      TYPE: 'SCIENTIFIC_ECOSYSTEM__PROJECTS',
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
      TYPE: 'SCIENTIFIC_ECOSYSTEM__CONTACT',
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

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import {
  ALL_SCIENTIFIC_ECOSYSTEM_SECTIONS,
  SCIENTIFIC_ECOSYSTEM_SECTIONS_MAP,
  ScientificEcosystemData,
  ScientificEcosystemDetailResourceType,
  ScientificEcosystemDetailType,
} from '../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { LangService } from '../../../../services/shared/lang/lang.service';
import { ScientificEcosystemSidebarComponent } from './components/scientific-ecosystem-sidebar/scientific-ecosystem-sidebar.component';
import labels from './scientific-ecosystem.lang';
import { ScientificEcosystemSectionComponent } from './components/scientific-ecosystem-section/scientific-ecosystem-section.component';

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
export class ScientificEcosystemPage implements OnInit {
  public ecosystemData: ScientificEcosystemData = sampleEcosystemData;
  public isLoading = true;
  public hasError = false;
  public activeSections: ScientificEcosystemDetailResourceType[] = [
    'SCIENTIFIC_ECOSYSTEM__ABOUT_US',
    'SCIENTIFIC_ECOSYSTEM__GENERAL_OBJECTIVE',
    'SCIENTIFIC_ECOSYSTEM__SPECIFIC_OBJECTIVES',
  ];

  public ALL_SECTIONS = ALL_SCIENTIFIC_ECOSYSTEM_SECTIONS;
  public SECTIONS_MAP = SCIENTIFIC_ECOSYSTEM_SECTIONS_MAP;

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

  public handleToggleSection(
    sectionType: ScientificEcosystemDetailResourceType,
  ): void {
    if (this.activeSections.includes(sectionType)) {
      this.activeSections = this.activeSections.filter(
        (type) => type !== sectionType,
      );
    } else {
      this.activeSections.push(sectionType);
    }
  }

  public getSectionDetailType(
    type: ScientificEcosystemDetailResourceType,
  ): ScientificEcosystemDetailType {
    return this.ecosystemData.sections.find(
      (section) => section.TYPE === type,
    )!;
  }
}
