import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Role } from '../../intranet/user/user.interfaces';
import { AppLocale } from '../lang/lang.interfaces';

type GlobalSearchItem = {
  name: AppLocale;
  url: string;
  fragment?: string;
  allowedRoles?: Role[];
  breadCrumbs: AppLocale[];
};

@Injectable({
  providedIn: 'root',
})
export class LocalSearchService {
  public authService = inject(AuthService);

  public fetchAllSearchRecommendations(
    searchTerm: string,
    mode: 'LANDING' | 'INTRANET',
  ): Observable<GlobalSearchItem[]> {
    if (searchTerm === '') return of([]);

    if (mode === 'LANDING') {
      return of(this.getLandingSections(searchTerm));
    } else {
      return of(this.getIntranetSections(searchTerm));
    }
  }

  private getLandingSections(searchTerm: string) {
    return this.landingSections.filter((section) =>
      Object.keys(section.name).some((key) =>
        section.name[key as keyof AppLocale]
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    );
  }

  private getIntranetSections(searchTerm: string) {
    return this.intranetSections.filter((section) => {
      return Object.keys(section.name).some((key) =>
        section.name[key as keyof AppLocale]
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      );
    });
  }

  private get landingSections(): GlobalSearchItem[] {
    return [
      {
        name: { es: 'Objetivo General', en: 'General Objective' },
        url: '/acerca-de',
        fragment: 'objetivo-general',
        breadCrumbs: [],
      },
      {
        name: { es: 'Objetivos Específicos', en: 'Specific Objectives' },
        url: '/acerca-de',
        fragment: 'objetivos-especificos',
        breadCrumbs: [],
      },
      {
        name: {
          es: 'Comisiones de Trabajo de la Red',
          en: 'Network Working Commissions',
        },
        url: '/acerca-de',
        fragment: 'comisiones',
        breadCrumbs: [],
      },
      {
        name: { es: 'Lineamientos de la Red', en: 'Network Guidelines' },
        url: '/lineamientos',
        breadCrumbs: [],
      },
      {
        name: { es: 'Misiones Transformativas', en: 'Transformative Missions' },
        url: '/misiones-transformativas',
        breadCrumbs: [],
      },
      {
        name: { es: 'Misiones Transformativas', en: 'Transformative Missions' },
        url: '/misiones-transformativas',
        breadCrumbs: [],
      },
      {
        name: { es: 'Mapa de Miembros de la Red', en: 'Network Members Map' },
        url: '/miembros-red',
        fragment: 'mapa',
        breadCrumbs: [],
      },
      {
        name: {
          es: 'Grupo Coordinador de la Red',
          en: 'Coordinating Group of the Network',
        },
        url: '/miembros-red',
        fragment: 'grupo-coordinador',
        breadCrumbs: [],
      },
      {
        name: {
          es: 'Grupo Facilitador de la Red',
          en: 'Facilitating Group of the Network',
        },
        url: '/miembros-red',
        fragment: 'grupo-facilitador',
        breadCrumbs: [],
      },
    ];
  }

  private get intranetSections(): GlobalSearchItem[] {
    const intranetSections: GlobalSearchItem[] = [
      {
        name: { es: 'Perfíl', en: 'Profile' },
        url: '/intranet/perfil',
        allowedRoles: [], // Empty array means all roles are allowed
        breadCrumbs: [],
      },
      {
        name: { es: 'Editar Perfil', en: 'Edit Profile' },
        url: '/intranet/perfil/editar',
        breadCrumbs: [{ es: 'Perfil', en: 'Profile' }],
        allowedRoles: [],
      },
      {
        name: { es: 'Mi Vinculación', en: 'My Linking' },
        url: '/intranet/vinculacion',
        breadCrumbs: [{ es: 'Vinculación', en: 'Linking' }],
        allowedRoles: [],
      },
      {
        name: { es: 'Certificado de Vinculación', en: 'Linking Certificate' },
        url: '/intranet/vinculacion',
        breadCrumbs: [{ es: 'Vinculación', en: 'Linking' }],
        allowedRoles: [
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_OPERATIONAL_COORDINATOR,
          Role.ROLE_COORDINATOR,
          Role.ROLE_FACILITATOR,
          Role.ROLE_LINKED,
        ],
      },
      {
        name: { es: 'Carta de Aprobación', en: 'Approval Letter' },
        url: '/intranet/vinculacion',
        breadCrumbs: [{ es: 'Vinculación', en: 'Linking' }],
        allowedRoles: [
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_OPERATIONAL_COORDINATOR,
          Role.ROLE_COORDINATOR,
          Role.ROLE_FACILITATOR,
          Role.ROLE_LINKED,
        ],
      },
      {
        name: { es: 'Carnet de la Red', en: 'Network Card' },
        url: '/intranet/vinculacion',
        breadCrumbs: [{ es: 'Vinculación', en: 'Linking' }],
        allowedRoles: [
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_OPERATIONAL_COORDINATOR,
          Role.ROLE_COORDINATOR,
          Role.ROLE_FACILITATOR,
          Role.ROLE_LINKED,
        ],
      },
      {
        name: {
          es: 'Miembros en la Comisión De Organización De Eventos Científicos Y Académicos',
          en: 'Members of the Commission for the Organization of Scientific and Academic Events',
        },
        url: '/intranet/comisiones/comision-organizacion-eventos',
        breadCrumbs: [{ es: 'Comisiones', en: 'Commissions' }],
        allowedRoles: [
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_OPERATIONAL_COORDINATOR,
          Role.ROLE_FACILITATOR,
        ],
      },
      {
        name: {
          es: 'Miembros en la Comisión Para La Formulación De Proyectos',
          en: 'Members of the Commission for the Formulation of Projects',
        },
        url: '/intranet/comisiones/comision-formulacion-proyectos',
        breadCrumbs: [{ es: 'Comisiones', en: 'Commissions' }],
        allowedRoles: [
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_OPERATIONAL_COORDINATOR,
          Role.ROLE_FACILITATOR,
        ],
      },
      {
        name: {
          es: 'Miembros en la Comisión De Organización De Eventos Científicos Y Académicos',
          en: 'Members of the Commission for the Organization of Scientific and Academic Events',
        },
        url: '/intranet/comisiones/comision-organizacion-eventos',
        breadCrumbs: [{ es: 'Comisiones', en: 'Commissions' }],
        allowedRoles: [
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_OPERATIONAL_COORDINATOR,
          Role.ROLE_FACILITATOR,
        ],
      },
      {
        name: { es: 'Actas por Comisión', en: 'Commission Minutes' },
        url: '/intranet/actas/comisiones',
        breadCrumbs: [{ es: 'Actas', en: 'Minutes' }],
        allowedRoles: [
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_OPERATIONAL_COORDINATOR,
          Role.ROLE_COORDINATOR,
          Role.ROLE_FACILITATOR,
          Role.ROLE_LINKED,
        ],
      },
      {
        name: {
          es: 'Actas del Grupo Coordinador',
          en: 'Coodinating Group Minutes',
        },
        url: '/intranet/actas/grupo-coordinador',
        breadCrumbs: [{ es: 'Actas', en: 'Minutes' }],
        allowedRoles: [
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_OPERATIONAL_COORDINATOR,
          Role.ROLE_COORDINATOR,
        ],
      },
      {
        name: {
          es: 'Actas del Grupo Facilitador',
          en: 'Facilitating Group Minutes',
        },
        url: '/intranet/actas/grupo-facilitador',
        breadCrumbs: [{ es: 'Actas', en: 'Minutes' }],
        allowedRoles: [
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_OPERATIONAL_COORDINATOR,
          Role.ROLE_FACILITATOR,
        ],
      },
      {
        name: { es: 'Gestión de comunicados', en: 'Announcements Management' },
        url: '/intranet/gestion-contenido/comunicados',
        breadCrumbs: [
          { es: 'Gestión de Contenido', en: 'Contents Management' },
        ],
        allowedRoles: [Role.ROLE_SUPER_ADMIN],
      },
      {
        name: { es: 'Gestión de Convoctorias', en: 'Convocations Management' },
        url: '/intranet/gestion-contenido/convocatorias',
        breadCrumbs: [
          { es: 'Gestión de Contenido', en: 'Contents Management' },
        ],
        allowedRoles: [Role.ROLE_SUPER_ADMIN],
      },
      {
        name: { es: 'Gestión de Eventos', en: 'Events Management' },
        url: '/intranet/gestion-contenido/eventos',
        breadCrumbs: [
          { es: 'Gestión de Contenido', en: 'Contents Management' },
        ],
        allowedRoles: [Role.ROLE_SUPER_ADMIN],
      },
      {
        name: { es: 'Gestión de Noticias', en: 'News Management' },
        url: '/intranet/gestion-contenido/noticias',
        breadCrumbs: [
          { es: 'Gestión de Contenido', en: 'Contents Management' },
        ],
        allowedRoles: [Role.ROLE_SUPER_ADMIN],
      },
      {
        name: {
          es: 'Gestión del Mapa de Colaboradores',
          en: 'Collaborators Map Management',
        },
        url: '/intranet/gestion-contenido/mapa',
        breadCrumbs: [
          { es: 'Gestión de Contenido', en: 'Contents Management' },
        ],
        allowedRoles: [Role.ROLE_SUPER_ADMIN],
      },
      {
        name: {
          es: 'Gestión del Grupo Coordinador',
          en: 'Coordinating Group Management',
        },
        url: '/intranet/gestion-contenido/grupo-coordinador',
        breadCrumbs: [
          { es: 'Gestión de Contenido', en: 'Contents Management' },
        ],
        allowedRoles: [Role.ROLE_SUPER_ADMIN],
      },
      {
        name: {
          es: 'Gestión del Grupo Facilitador',
          en: 'Facilitating Group Management',
        },
        url: '/intranet/gestion-contenido/grupo-facilitador',
        breadCrumbs: [
          { es: 'Gestión de Contenido', en: 'Contents Management' },
        ],
        allowedRoles: [Role.ROLE_SUPER_ADMIN],
      },
      {
        name: { es: 'Gestión del NPC', en: 'NCP Management' },
        url: '/intranet/gestion-contenido/npc',
        breadCrumbs: [
          { es: 'Gestión de Contenido', en: 'Contents Management' },
        ],
        allowedRoles: [Role.ROLE_SUPER_ADMIN],
      },
      {
        name: {
          es: 'Gestión de Colaboradores',
          en: 'Collaborators Management',
        },
        url: '/intranet/gestion-contenido/colaboradores',
        breadCrumbs: [
          { es: 'Gestión de Contenido', en: 'Contents Management' },
        ],
        allowedRoles: [Role.ROLE_SUPER_ADMIN],
      },
      {
        name: { es: 'Gestión de Publicaciones', en: 'Publications Management' },
        url: '/intranet/gestion-contenido/publicaciones',
        breadCrumbs: [
          { es: 'Gestión de Contenido', en: 'Contents Management' },
        ],
        allowedRoles: [Role.ROLE_SUPER_ADMIN],
      },
      {
        name: {
          es: 'Gestión de Boletínes de Noticias',
          en: 'newsletters Management',
        },
        url: '/intranet/gestion-contenido/boletin-noticias',
        breadCrumbs: [
          { es: 'Gestión de Contenido', en: 'Contents Management' },
        ],
        allowedRoles: [Role.ROLE_SUPER_ADMIN],
      },
      {
        name: { es: 'Gestión de Memorias', en: 'Memories Management' },
        url: '/intranet/gestion-contenido/memorias',
        breadCrumbs: [
          { es: 'Gestión de Contenido', en: 'Contents Management' },
        ],
        allowedRoles: [Role.ROLE_SUPER_ADMIN],
      },
    ];

    return intranetSections
      .filter(({ allowedRoles }) => {
        if (!this.authService.activeRole) return false;
        if (!allowedRoles) return true;
        if (allowedRoles.length === 0) return true;

        return allowedRoles.includes(this.authService.activeRole?.role);
      })
      .map(({ name, url, breadCrumbs }) => ({ name, url, breadCrumbs }));
  }
}
