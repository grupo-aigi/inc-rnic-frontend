import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ScientificEcosystemDetailResourceType } from '../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './scientific-ecosystem-sidebar.lang';
import { ScientificEcosystemStateService } from '../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem-state.service';

interface EcosystemSidebarOption {
  label: { es: string; en: string };
  sectionType: ScientificEcosystemDetailResourceType;
}

@Component({
  standalone: true,
  selector: 'app-scientific-ecosystem-sidebar',
  templateUrl: './scientific-ecosystem-sidebar.component.html',
  styleUrls: ['./scientific-ecosystem-sidebar.component.scss'],
  imports: [CommonModule, RouterLink, RouterModule, RouterLinkActive],
})
export class ScientificEcosystemSidebarComponent implements OnInit, OnDestroy {
  @Output() sectionClicked =
    new EventEmitter<ScientificEcosystemDetailResourceType>();

  public sidebarOptions: EcosystemSidebarOption[] = [];
  public activeSections: ScientificEcosystemDetailResourceType[] = [];

  private destroy$ = new Subject<void>();

  public constructor(
    private router: Router,
    private langService: LangService,
    private stateService: ScientificEcosystemStateService,
  ) {}

  public ngOnInit(): void {
    this.setSidebarOptions();

    // Suscribirse a cambios de secciones activas
    this.stateService.activeSections$
      .pipe(takeUntil(this.destroy$))
      .subscribe((sections) => {
        this.activeSections = sections;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setSidebarOptions(): void {
    this.sidebarOptions = [
      {
        label: { es: 'Nosotros', en: 'About us' },
        sectionType: 'SCIENTIFIC_ECOSYSTEM__ABOUT_US',
      },
      {
        label: { es: 'Objetivo General', en: 'General Objective' },
        sectionType: 'SCIENTIFIC_ECOSYSTEM__GENERAL_OBJECTIVE',
      },
      {
        label: { es: 'Objetivos Específicos', en: 'Specific Objectives' },
        sectionType: 'SCIENTIFIC_ECOSYSTEM__SPECIFIC_OBJECTIVES',
      },
      {
        label: { es: 'Hoja de Ruta', en: 'Roadmap' },
        sectionType: 'SCIENTIFIC_ECOSYSTEM__ROADMAP',
      },
      {
        label: { es: 'Lineamientos', en: 'Guidelines' },
        sectionType: 'SCIENTIFIC_ECOSYSTEM__GUIDELINES',
      },
      {
        label: { es: 'Integrantes', en: 'Members' },
        sectionType: 'SCIENTIFIC_ECOSYSTEM__MEMBERS',
      },
      {
        label: { es: 'Proyectos', en: 'Projects' },
        sectionType: 'SCIENTIFIC_ECOSYSTEM__PROJECTS',
      },
      {
        label: { es: 'Contacto', en: 'Contact' },
        sectionType: 'SCIENTIFIC_ECOSYSTEM__CONTACT',
      },
    ];
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public isSectionActive(
    sectionType: ScientificEcosystemDetailResourceType,
  ): boolean {
    return this.activeSections.includes(sectionType);
  }

  public handleSectionClick(
    sectionType: ScientificEcosystemDetailResourceType,
    event: Event,
  ): void {
    event.preventDefault();
    this.sectionClicked.emit(sectionType);
  }
}
