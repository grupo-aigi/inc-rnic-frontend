import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';

import { LangService } from '../../../../../../services/shared/lang/lang.service';
import {
  SidebarOption,
  SimpleSidebarOption,
} from '../../../../../../services/shared/layout/layout.interfaces';
import labels from './scientific-ecosystem-sidebar.lang';

@Component({
  standalone: true,
  selector: 'app-scientific-ecosystem-sidebar',
  templateUrl: './scientific-ecosystem-sidebar.component.html',
  imports: [RouterLink, RouterModule, RouterLinkActive],
})
export class ScientificEcosystemSidebarComponent implements OnInit {
  public sidebarOptions: SimpleSidebarOption[] = [];
  public constructor(
    private router: Router,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.setSidebarOptions();
  }

  private setSidebarOptions(): void {
    this.sidebarOptions = [
      {
        label: { es: 'Nosotros', en: 'About us' },
        route: '#section',
      },
      {
        label: { es: 'Objetivo General', en: 'General Objective' },
        route: '#section',
      },
      {
        label: { es: 'Objetivos Específicos', en: 'Specific Objectives' },
        route: '#section',
      },
      {
        label: { es: 'Hoja de Ruta', en: 'Roadmap' },
        route: '#section',
      },
      {
        label: { es: 'Lineamientos', en: 'Guidelines' },
        route: '#section',
      },
      {
        label: { es: 'Cómo participar', en: 'How to Participate' },
        route: '#section',
      },
      {
        label: { es: 'Integrantes', en: 'Members' },
        route: '#section',
      },
      {
        label: { es: 'Proyectos', en: 'Projects' },
        route: '#section',
      },
      {
        label: { es: 'Eventos', en: 'Events' },
        route: '#section',
      },
      {
        label: { es: 'Contacto', en: 'Contact' },
        route: '#section',
      },
    ];
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public handleToggle(option: SidebarOption) {
    option.open = !option.open;
  }
}
