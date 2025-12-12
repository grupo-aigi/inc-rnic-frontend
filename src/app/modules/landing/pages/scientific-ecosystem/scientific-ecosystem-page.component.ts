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
  ScientificEcosystemDetailAboutUs,
  ScientificEcosystemDetailContact,
  ScientificEcosystemDetailEvents,
  ScientificEcosystemDetailGeneralObjective,
  ScientificEcosystemDetailGuidelines,
  ScientificEcosystemDetailHowToParticipate,
  ScientificEcosystemDetailMembers,
  ScientificEcosystemDetailNews,
  ScientificEcosystemDetailProjects,
  ScientificEcosystemDetailResourceType,
  ScientificEcosystemDetailRoadmap,
  ScientificEcosystemDetailSpecificObjectives,
  ScientificEcosystemDetailType,
} from '../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { LangService } from '../../../../services/shared/lang/lang.service';
import { ScientificEcosystemSectionComponent } from './components/scientific-ecosystem-section/scientific-ecosystem-section.component';
import { ScientificEcosystemSidebarComponent } from './components/scientific-ecosystem-sidebar/scientific-ecosystem-sidebar.component';
import labels from './scientific-ecosystem.lang';
import { ScientificEcosystemService } from '../../../../services/landing/scientific-ecosystem/scientific-ecosystem.service';

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
  public loadingDetail = true;
  public hasError = false;
  public activeSections: ScientificEcosystemDetailResourceType[] = [];
  public ecosystemData!: ScientificEcosystemData;
  public SECTIONS_TO_SHOW: ScientificEcosystemDetailResourceType[] = [];
  public SECTIONS_MAP = SCIENTIFIC_ECOSYSTEM_SECTIONS_MAP;

  private destroy$ = new Subject<void>();

  public constructor(
    private title: Title,
    private langService: LangService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private stateService: ScientificEcosystemStateService,
    private scientificEcosystemService: ScientificEcosystemService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);

    this.langService.language$
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.title.setTitle(labels.pageTitle[lang]);
      });

    this.stateService.activeSections$
      .pipe(takeUntil(this.destroy$))
      .subscribe((sections) => {
        this.activeSections = sections;
      });

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

    this.loadingDetail = true;
    this.scientificEcosystemService
      .fetchScientificEcosystemDetailByUrlName(
        this.route.snapshot.paramMap.get('urlName')!,
      )
      .subscribe((response) => {
        this.ecosystemData = response;
        this.loadingDetail = false;

        this.filterNonEmptySections();
      });
  }

  public filterNonEmptySections() {
    const { resources } = this.ecosystemData;
    this.SECTIONS_TO_SHOW = resources
      .filter(({ content, resourceType }) => {
        const contentObj = JSON.parse(content);
        switch (resourceType as ScientificEcosystemDetailResourceType) {
          case 'NOSOTROS':
            const aboutUs = contentObj as ScientificEcosystemDetailAboutUs;
            return aboutUs.description.length > 0;
          case 'OBJ_GENERAL':
            const generalObj =
              contentObj as ScientificEcosystemDetailGeneralObjective;
            return generalObj.generalObjective.length > 0;
          case 'OBJ_ESPECIFICOS':
            const specificObjs =
              contentObj as ScientificEcosystemDetailSpecificObjectives;
            return specificObjs.specificObjectives.length > 0;
          case 'HOJA_RUTA':
            const roadmap = contentObj as ScientificEcosystemDetailRoadmap;
            return (
              roadmap.paragraphs.length > 0 ||
              roadmap.images.length > 0 ||
              roadmap.resources.length > 0
            );
          case 'LINEAMIENTOS':
            const guidelines =
              contentObj as ScientificEcosystemDetailGuidelines;
            return (
              guidelines.paragraphs.length > 0 ||
              guidelines.images.length > 0 ||
              guidelines.resources.length > 0
            );
          case 'COMO_PARTICIPAR':
            const howToParticipate =
              contentObj as ScientificEcosystemDetailHowToParticipate;
            return (
              howToParticipate.paragraphs.length > 0 ||
              howToParticipate.images.length > 0 ||
              howToParticipate.resources.length > 0
            );
          case 'INTEGRANTES':
            const members = contentObj as ScientificEcosystemDetailMembers;
            return (
              members.paragraphs.length > 0 ||
              members.images.length > 0 ||
              members.resources.length > 0
            );
          case 'PROYECTOS':
            const projects = contentObj as ScientificEcosystemDetailProjects;
            return (
              projects.paragraphs.length > 0 ||
              projects.projects.length > 0 ||
              projects.images.length > 0 ||
              projects.resources.length > 0
            );
          case 'EVENTOS':
            const events = contentObj as ScientificEcosystemDetailEvents;
            return events.events.length > 0;
          case 'NOTICIAS':
            const news = contentObj as ScientificEcosystemDetailNews;
            return news.news.length > 0;
          case 'CONTACTO':
            const contact = contentObj as ScientificEcosystemDetailContact;
            return contact.contacts.length > 0;
          //
          default:
            return true;
        }
      })
      .map(
        ({ resourceType }) =>
          resourceType as ScientificEcosystemDetailResourceType,
      );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.stateService.expandAll(this.SECTIONS_TO_SHOW);
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
    // return this.ecosystemData.sections.find(
    //   (section) => section.TYPE === type,
    // )!;

    const contentStr = this.ecosystemData.resources.find(
      (a) => a.resourceType === type,
    )!.content;

    const data = JSON.parse(contentStr) as ScientificEcosystemDetailType;
    return { ...data, TYPE: type };
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
