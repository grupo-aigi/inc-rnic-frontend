import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../../../../../../services/auth/auth.service';
import { Role } from '../../../../../../../../services/intranet/user/user.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { SidebarOption } from '../../../../../../../../services/shared/layout/layout.interfaces';
import labels from './mobile-routes.lang';

@Component({
  standalone: true,
  selector: 'app-intranet-mobile-routes',
  templateUrl: './mobile-routes.component.html',
  imports: [RouterLink, RouterLinkActive],
})
export class MobileRoutesComponent implements OnInit {
  @Output() public onNavigate: EventEmitter<void> = new EventEmitter<void>();
  public sidebarOptions: SidebarOption[] = [];

  public constructor(
    private langService: LangService,
    private authService: AuthService,
  ) {}

  public ngOnInit(): void {
    this.setSidebarOptions();
    this.authService.activeRole$.subscribe((activeRole) => {
      this.setSidebarOptions();
    });
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleToggle(option: SidebarOption) {
    option.open = !option.open;
  }

  public handleCloseTopBar() {
    this.onNavigate.emit();
  }

  private setSidebarOptions(): void {
    this.sidebarOptions = [
      {
        label: { es: 'Perfil', en: 'Profile' },
        icon: 'bx bx-user',
        open: false,
        route: '/intranet/perfil',
        display: this.displayNavbarItem([
          // All roles allowed
        ]),
      },
      {
        label: { es: 'Vinculación', en: 'Linking' },
        icon: 'bx bx-link-alt',
        open: false,
        route: '/intranet/vinculacion',
        display: this.displayNavbarItem([
          // All roles allowed
        ]),
      },
      {
        label: { es: 'Perfil de Idea', en: 'Projects' },
        icon: 'bx bx-briefcase',
        open: false,
        route: '/intranet/proyectos',
        display: this.displayNavbarItem([
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_LINKED,
          Role.ROLE_COORDINATOR,
          Role.ROLE_FACILITATOR,
          Role.ROLE_OPERATIONAL_COORDINATOR,
        ]),
      },
      {
        label: { es: 'Comisiones', en: 'Commissions' },
        icon: 'bx bx-group',
        open: false,
        route: '/intranet/comisiones',
        display: this.displayNavbarItem([
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_FACILITATOR,
          Role.ROLE_OPERATIONAL_COORDINATOR,
        ]),
      },
      {
        label: { es: 'Gestión de Usuarios', en: 'Users Management' },
        icon: 'bx bxs-user-account',
        open: false,
        route: '/intranet/usuarios',
        display: this.displayNavbarItem([
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_OPERATIONAL_COORDINATOR,
        ]),
      },
      {
        label: { es: 'Actas', en: 'Minutes' },
        icon: 'bx bx-file',
        route: '/intranet/actas',
        open: false,
        display: this.displayNavbarItem([
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_LINKED,
          Role.ROLE_COORDINATOR,
          Role.ROLE_FACILITATOR,
          Role.ROLE_OPERATIONAL_COORDINATOR,
        ]),
      },
      {
        label: { es: 'Gestión de Vinculaciones', en: 'Linking Management' },
        open: false,
        icon: 'bx bxs-user-detail',
        route: '/intranet/gestion-red',
        display: this.displayNavbarItem([
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_OPERATIONAL_COORDINATOR,
        ]),
      },
      {
        label: { es: 'Gestión de contenido', en: 'Content management' },
        open: false,
        icon: 'bx bx-book-content',
        route: '/intranet/gestion-contenido',
        display: this.displayNavbarItem([Role.ROLE_SUPER_ADMIN]),
        children: [
          {
            label: { es: 'Comunicados', en: 'Announcements' },
            icon: 'bx bxs-megaphone',
            route: '/intranet/gestion-contenido/comunicados',
            open: false,
            display: this.displayNavbarItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            label: { es: 'Convocatorias', en: 'Convocations' },
            icon: 'bx bx-notepad',
            route: '/intranet/gestion-contenido/convocatorias',
            open: false,
            display: this.displayNavbarItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            label: { es: 'Eventos', en: 'Events' },
            icon: 'bx bx-calendar-event',
            route: '/intranet/gestion-contenido/eventos',
            open: false,
            display: this.displayNavbarItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            label: { es: 'Noticias', en: 'News' },
            icon: 'bx bx-news',
            route: '/intranet/gestion-contenido/noticias',
            open: false,
            display: this.displayNavbarItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            label: { es: 'Mapa de colaboradores', en: 'Partners map' },
            icon: 'bx bx-map-alt',
            route: '/intranet/gestion-contenido/mapa',
            open: false,
            display: this.displayNavbarItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            label: { es: 'Grupo Coordinador', en: 'Coordinating proup' },
            icon: 'bx bx-sitemap',
            route: '/intranet/gestion-contenido/grupo-coordinador',
            open: false,
            display: this.displayNavbarItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            label: { es: 'Grupo Facilitador', en: 'Facilitating group' },
            icon: 'bx bx-sitemap',
            route: '/intranet/gestion-contenido/grupo-facilitador',
            open: false,
            display: this.displayNavbarItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            label: { es: 'Actualizar PNC', en: 'Update NCP' },
            icon: 'bx bx-phone-call',
            route: '/intranet/gestion-contenido/ncp',
            open: false,
            display: this.displayNavbarItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            label: { es: 'Colaboradores de La Red', en: 'Network ' },
            icon: 'bx bx-donate-heart',
            route: '/intranet/gestion-contenido/colaboradores',
            open: false,
            display: this.displayNavbarItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            label: { es: 'Publicaciones', en: 'Publications ' },
            icon: 'bx bxs-file-pdf',
            route: '/intranet/gestion-contenido/publicaciones',
            open: false,
            display: this.displayNavbarItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            label: { es: 'Boletines', en: 'Newsletters ' },
            icon: 'bx bxs-book-open',
            route: '/intranet/gestion-contenido/boletin-noticias',
            open: false,
            display: this.displayNavbarItem([Role.ROLE_SUPER_ADMIN]),
          },
          {
            label: { es: 'Ecosistema Científico', en: 'Scientific Ecosystem' },
            icon: 'bx bx-science',
            route: '/intranet/gestion-contenido/ecosistema-cientifico',
            open: false,
            display: this.displayNavbarItem([Role.ROLE_SUPER_ADMIN]),
          },
        ],
      },
    ];
  }

  public displayNavbarItem(allowedRoles: Role[]): boolean {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    const { userInfo, activeRole } = this.authService;
    const userAllowed = allowedRoles.some((role) =>
      userInfo!.roles.map(({ role }) => role).includes(role),
    );

    if (!userAllowed) {
      return false;
    }
    const isActiveRoleAllowed = allowedRoles.some(
      (role) => role === activeRole!.role,
    );

    if (!isActiveRoleAllowed) {
      return false;
    }
    return true;
  }
}
