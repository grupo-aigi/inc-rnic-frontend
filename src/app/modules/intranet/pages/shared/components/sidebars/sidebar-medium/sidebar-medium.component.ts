import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import tippy from 'tippy.js';

import { AuthService } from '../../../../../../../services/auth/auth.service';
import { Role } from '../../../../../../../services/intranet/user/user.interfaces';
import { AppLanguage } from '../../../../../../../services/shared/lang/lang.interfaces';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';
import { SidebarMediumOption } from '../../../../../../../services/shared/layout/layout.interfaces';
import labels from './sidebar-medium.lang';

@Component({
  standalone: true,
  selector: 'app-sidebar-medium',
  templateUrl: './sidebar-medium.component.html',
  imports: [RouterLink],
})
export class SidebarMediumComponent implements OnInit, AfterViewInit {
  public sidebarOptions: SidebarMediumOption[] = [];

  public constructor(
    private authService: AuthService,
    private langService: LangService,
    private toastService: ToastrService,
  ) {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public ngOnInit(): void {
    this.setSidebarOptions();
    this.authService.activeRole$.subscribe((activeRole) => {
      this.setSidebarOptions();
      this.setUpTooltips();
    });
  }

  public ngAfterViewInit() {
    this.setUpTooltips();
    this.langService.language$.subscribe((lang: AppLanguage) => {
      this.setUpTooltips();
    });
  }

  private setSidebarOptions(): void {
    this.sidebarOptions = [
      {
        id: '0',
        label: { es: 'Perfil', en: 'Profile' },
        icon: 'bx bx-user',
        open: false,
        route: '/intranet/perfil',
        display: this.displayItem([
          // All roles allowed
        ]),
      },
      {
        id: '1',
        label: { es: 'Vinculación', en: 'Linking' },
        icon: 'bx bx-link-alt',
        open: false,
        route: '/intranet/vinculacion',
        display: this.displayItem([
          // All roles allowed
        ]),
      },
      {
        id: '2',
        label: { es: 'Perfil de Idea', en: 'Projects' },
        icon: 'bx bx-briefcase',
        open: false,
        route: '/intranet/proyectos',
        display: this.displayItem([
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_LINKED,
          Role.ROLE_COORDINATOR,
          Role.ROLE_FACILITATOR,
          Role.ROLE_OPERATIONAL_COORDINATOR,
        ]),
      },
      {
        id: '3',
        label: { es: 'Comisiones', en: 'Commissions' },
        icon: 'bx bx-group',
        open: false,
        route: '/intranet/comisiones',
        display: this.displayItem([
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_FACILITATOR,
          Role.ROLE_OPERATIONAL_COORDINATOR,
        ]),
      },
      {
        id: '4',
        label: { es: 'Gestión de Usuarios', en: 'Users Management' },
        icon: 'bx bxs-user-account',
        open: false,
        route: '/intranet/usuarios',
        display: this.displayItem([
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_OPERATIONAL_COORDINATOR,
        ]),
      },
      {
        id: '5',
        label: { es: 'Actas', en: 'Minutes' },
        icon: 'bx bx-file',
        route: '/intranet/actas',
        open: false,
        display: this.displayItem([
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_LINKED,
          Role.ROLE_COORDINATOR,
          Role.ROLE_FACILITATOR,
          Role.ROLE_OPERATIONAL_COORDINATOR,
        ]),
      },
      {
        id: '10',
        label: { es: 'Gestión de la Red', en: 'Linking management' },
        open: false,
        icon: 'bx bxs-user-detail',
        route: '/intranet/gestion-red',
        display: this.displayItem([
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_OPERATIONAL_COORDINATOR,
        ]),
      },
      {
        id: '11',
        label: { es: 'Gestión de contenido', en: 'Content management' },
        open: false,
        icon: 'bx bx-book-content',
        route: '/intranet/gestion-contenido',
        display: this.displayItem([Role.ROLE_SUPER_ADMIN]),
        children: [
          {
            id: '12',
            label: { es: 'Comunicados', en: 'Announcements' },
            icon: 'bx bxs-megaphone',
            route: '/intranet/gestion-contenido/comunicados',
            open: false,
            display: this.displayItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            id: '13',
            label: { es: 'Convocatorias', en: 'Convocations' },
            icon: 'bx bx-notepad',
            route: '/intranet/gestion-contenido/convocatorias',
            open: false,
            display: this.displayItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            id: '14',
            label: { es: 'Eventos', en: 'Events' },
            icon: 'bx bx-calendar-event',
            route: '/intranet/gestion-contenido/eventos',
            open: false,
            display: this.displayItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            id: '15',
            label: { es: 'Noticias', en: 'News' },
            icon: 'bx bx-news',
            route: '/intranet/gestion-contenido/noticias',
            open: false,
            display: this.displayItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            id: '16',
            label: { es: 'Mapa de colaboradores', en: 'Partners map' },
            icon: 'bx bx-map-alt',
            route: '/intranet/gestion-contenido/mapa',
            open: false,
            display: this.displayItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            id: '17',
            label: { es: 'Grupo Coordinador', en: 'Coordinating proup' },
            icon: 'bx bx-sitemap',
            route: '/intranet/gestion-contenido/grupo-coordinador',
            open: false,
            display: this.displayItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            id: '18',
            label: { es: 'Grupo Facilitador', en: 'Facilitating group' },
            icon: 'bx bx-sitemap',
            route: '/intranet/gestion-contenido/grupo-facilitador',
            open: false,
            display: this.displayItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            id: '19',
            label: { es: 'Actualizar PNC', en: 'Update NCP' },
            icon: 'bx bx-phone-call',
            route: '/intranet/gestion-contenido/ncp',
            open: false,
            display: this.displayItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            id: '20',
            label: { es: 'Colaboradores de La Red', en: 'Network' },
            icon: 'bx bx-donate-heart',
            route: '/intranet/gestion-contenido/colaboradores',
            open: false,
            display: this.displayItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            id: '21',
            label: { es: 'Publicaciones', en: 'Publications' },
            icon: 'bx bxs-file-pdf',
            route: '/intranet/gestion-contenido/publicaciones',
            open: false,
            display: this.displayItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            id: '22',
            label: { es: 'Boletines', en: 'Newsletters' },
            icon: 'bx bxs-book-open',
            route: '/intranet/gestion-contenido/boletin-noticias',
            open: false,
            display: this.displayItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            id: '23',
            label: { es: 'Ecosistema Científico', en: 'Scientific Ecosystem' },
            icon: 'bx bx-science',
            route: '/intranet/gestion-contenido/ecosistema-cientifico',
            open: false,
            display: this.displayItem([Role.ROLE_SUPER_ADMIN]),
          },
        ],
      },
    ].filter((option) => option.display);
  }

  public displayItem(allowedRoles: Role[]): boolean {
    const { userInfo } = this.authService;
    if (!allowedRoles || allowedRoles.length === 0) return true;

    const userAllowed = allowedRoles.some((role) =>
      userInfo?.roles.map(({ role }) => role).includes(role),
    );

    if (!userAllowed) {
      return false;
    }
    const isActiveRoleAllowed = allowedRoles.some(
      (role) => role === this.authService.activeRole!.role,
    );

    if (!isActiveRoleAllowed) {
      return false;
    }
    return true;
  }

  private setUpTooltips() {
    let itemsDivList = document.querySelectorAll<HTMLElement>('.sidebar_item');

    itemsDivList.forEach((item) =>
      tippy(item, { placement: 'left', zIndex: -1000000 }),
    );

    itemsDivList.forEach((item) => {
      const text = item.title;
      const id = item.id;
      const option = this.sidebarOptions.find((link) => link.id === id)!;
      return tippy(item, {
        content: option.label[this.lang], // Tooltip content
        placement: 'right', // Tooltip position (top, bottom, left, right, etc.)
      });
    });
  }

  public handleToggle(option: SidebarMediumOption) {
    option.open = !option.open;
  }
}
