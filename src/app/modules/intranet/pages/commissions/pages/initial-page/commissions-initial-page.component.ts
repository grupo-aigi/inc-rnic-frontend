
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import tippy from 'tippy.js';

import { LangService } from '../../../../../../../app/services/shared/lang/lang.service';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { AppLanguage } from '../../../../../../services/shared/lang/lang.interfaces';
import { CommissionDirectLink } from '../../../../../../services/shared/misc/direct-links.interfaces';
import labels from './commissions-initial-page.lang';

@Component({
  standalone: true,
  templateUrl: './commissions-initial-page.component.html',
  imports: [RouterLink],
})
export class CommissionsInitialPage implements OnInit {
  public directLinks: CommissionDirectLink[] = [];

  public constructor(
    private title: Title,
    private authService: AuthService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
      this.setUpTooltips(lang);
    });
    this.setUpDirectLinks();
    this.authService.activeRole$.subscribe((role) => {
      this.setUpDirectLinks();
    });
  }

  private setUpDirectLinks() {
    this.directLinks = [
      {
        id: '0',
        label: {
          es: 'Comisión para el diseño y formulación de la misión control del  cáncer',
          en: 'Commission for the design and formulation of the cancer control mission',
        },
        // icon: 'bx bxs-megaphone',
        route: '/intranet/comisiones/comision-diseno-mision-cancer',
        description: {
          es: '',
          en: '',
        },
      },
      {
        id: '1',
        label: {
          es: 'Comisión para la formulación de proyectos',
          en: 'Commission for the formulation of projects',
        },
        // icon: 'bx bx-notepad',
        route: '/intranet/comisiones/comision-formulacion-proyectos',
        description: {
          es: '',
          en: '',
        },
      },
      {
        id: '2',
        label: {
          en: 'Commission for the organization of scientific and academic events',
          es: 'Comisión de organización de eventos científicos y académicos',
        },
        // icon: 'bx bx-calendar-event',
        route: '/intranet/comisiones/comision-organizacion-eventos',
        description: {
          en: '',
          es: '',
        },
      },
    ];
  }

  private setUpTooltips(lang?: AppLanguage) {
    let itemsDivList = document.querySelectorAll<HTMLElement>(
      '.certificate_card_link',
    );

    itemsDivList.forEach((item) => {
      const id = item.id;
      const link = this.directLinks.find((link) => link.id === id)!;
      return tippy(item, {
        content: link.description[lang || this.lang], // Tooltip content
        placement: 'top', // Tooltip position (top, bottom, left, right, etc.)
      });
    });
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }
}
