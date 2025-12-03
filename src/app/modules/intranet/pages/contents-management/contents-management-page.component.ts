import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import tippy from 'tippy.js';

import { AppLanguage } from '../../../../services/shared/lang/lang.interfaces';
import { LangService } from '../../../../services/shared/lang/lang.service';
import { ContentDirectLink } from '../../../../services/shared/misc/direct-links.interfaces';
import labels from './contents-management-page.lang';

@Component({
  standalone: true,
  templateUrl: './contents-management-page.component.html',
  imports: [RouterLink],
})
export class ContentsManagementPage implements OnInit, AfterViewInit {
  public directLinks: ContentDirectLink[] = [
    {
      id: '0',
      label: { es: 'Comunicados', en: 'Announcements' },
      icon: 'bx bxs-megaphone',
      route: '/intranet/gestion-contenido/comunicados',
      description: {
        es: 'Crea, actualiza o elimina los comunicados de la Red Nacional de Investigación en Cáncer.',
        en: 'Create, update or delete the announcements of the National Cancer Research Network.',
      },
    },
    {
      id: '1',
      label: { es: 'Convocatorias', en: 'Convocations' },
      icon: 'bx bx-notepad',
      route: '/intranet/gestion-contenido/convocatorias',
      description: {
        es: 'Crea, actualiza o elimina las convocatorias de la Red Nacional de Investigación en Cáncer.',
        en: 'Create, update or delete the convocations of the National Cancer Research Network.',
      },
    },
    {
      id: '2',
      label: { es: 'Eventos', en: 'Events' },
      icon: 'bx bx-calendar-event',
      route: '/intranet/gestion-contenido/eventos',
      description: {
        es: 'Crea, actualiza o elimina los eventos de la Red Nacional de Investigación en Cáncer.',
        en: 'Create, update or delete the events of the National Cancer Research Network.',
      },
    },
    {
      id: '3',
      label: { es: 'Noticias', en: 'News' },
      icon: 'bx bx-news',
      route: '/intranet/gestion-contenido/noticias',
      description: {
        es: 'Crea, actualiza o elimina las noticias de la Red Nacional de Investigación en Cáncer.',
        en: 'Create, update or delete the news of the National Cancer Research Network.',
      },
    },
    {
      id: '4',
      label: { es: 'Mapa de colaboradores', en: 'Partners map' },
      icon: 'bx bx-map-alt',
      route: '/intranet/gestion-contenido/mapa',
      description: {
        es: 'Actualiza el mapa de colaboradores de la Red Nacional de Investigación en Cáncer.',
        en: 'Update the partners map of the National Cancer Research Network.',
      },
    },
    {
      id: '5',
      label: { es: 'Grupo Coordinador', en: 'Coordinating group' },
      icon: 'bx bx-sitemap',
      route: '/intranet/gestion-contenido/grupo-coordinador',
      description: {
        es: 'Crea, actualiza o elimina miembros del grupo coordinador.',
        en: 'Create, update or delete members of the coordinating group.',
      },
    },
    {
      id: '6',
      label: { es: 'Grupo Facilitador', en: 'Facilitating group' },
      icon: 'bx bx-sitemap',
      route: '/intranet/gestion-contenido/grupo-facilitador',
      description: {
        es: 'Crea, actualiza o elimina miembros del grupo facilitador.',
        en: 'Create, update or delete members of the facilitating group.',
      },
    },
    {
      id: '7',
      label: { es: 'Actualizar PNC', en: 'Update NCP' },
      icon: 'bx bx-phone-call',
      route: '/intranet/gestion-contenido/ncp',
      description: {
        es: 'Actualiza el Punto Nacional de Contacto de la Red',
        en: 'Update the National Contact Point of the Network',
      },
    },
    {
      id: '8',
      label: { es: 'Colaboradores de La Red', en: 'Network partners' },
      icon: 'bx bx-donate-heart',
      route: '/intranet/gestion-contenido/colaboradores',
      description: {
        es: 'Crea, actualiza o elimina colaboradores de la Red.',
        en: 'Create, update or delete partners of the Network.',
      },
    },
    {
      id: '9',
      label: { es: 'Publicaciones', en: 'Publications' },
      icon: 'bx bxs-file-pdf',
      route: '/intranet/gestion-contenido/publicaciones',
      description: {
        es: 'Crea, actualiza o elimina publicaciones de la Red.',
        en: 'Create, update or delete publications of the Network.',
      },
    },
    {
      id: '10',
      label: { es: 'Boletín de Noticias', en: 'Newsletter' },
      icon: 'bx bxs-news',
      route: '/intranet/gestion-contenido/boletin-noticias',
      description: {
        es: 'Crea, actualiza o elimina boletines de noticias de la Red.',
        en: 'Create, update or delete newsletters of the Network.',
      },
    },
    {
      id: '11',
      label: { es: 'Memorias', en: 'Memories' },
      icon: 'bx bxs-book-open',
      route: '/intranet/gestion-contenido/memorias',
      description: {
        es: 'Crea, actualiza o elimina memorias de la Red.',
        en: 'Create, update or delete memories of the Network.',
      },
    },
    {
      id: '12',
      label: { es: 'Ecosistema Científico', en: 'Scientific Ecosystem' },
      icon: 'bx  bx-science',
      route: '/intranet/gestion-contenido/ecosistema-cientifico',
      description: {
        es: 'Gestiona la información del Ecosistema Científico de la Red.',
        en: "Manage the information of the Network's Scientific Ecosystem.",
      },
    },
  ];

  public constructor(
    private langService: LangService,
    private title: Title,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });
  }

  public ngAfterViewInit(): void {
    this.setUpTooltips();
    this.langService.language$.subscribe((lang) => {
      this.setUpTooltips(lang);
    });
  }

  private setUpTooltips(lang?: AppLanguage) {
    let itemsDivList =
      document.querySelectorAll<HTMLElement>('.content_mgmt_link');

    itemsDivList.forEach((item) => {
      const id = item.id;
      const link = this.directLinks.find((link) => link.id === id)!;
      return tippy(item, {
        content: link.description[lang || this.lang], // Tooltip content
        placement: 'top', // Tooltip position (top, bottom, left, right, etc.)
      });
    });
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }
}
