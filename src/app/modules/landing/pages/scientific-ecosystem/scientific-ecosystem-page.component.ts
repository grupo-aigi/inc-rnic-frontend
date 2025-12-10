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
      });
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
