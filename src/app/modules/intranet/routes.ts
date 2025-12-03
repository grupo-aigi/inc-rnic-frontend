import { Routes } from '@angular/router';

import { rolesGuard } from '../../guards/roles.guard';
import { Role } from '../../services/intranet/user/user.interfaces';
import { ConvocationDetailPage } from '../landing/pages/convocation-detail/convocation-detail-page.component';
import { ConvocationsPage } from '../landing/pages/convocations/convocations-page.component';
import { EventDetailPage } from '../landing/pages/event-detail/event-detail-page.component';
import { EventsPage } from '../landing/pages/events/events-page.component';
import { NewsDetailPage } from '../landing/pages/news-detail/news-detail-page.component';
import { NewsPage } from '../landing/pages/news/news-page.component';
import { PublicationDetailPage } from '../landing/pages/publications/publication-detail/publication-detail-page.component';
import { IntranetLayoutPage } from './intranet-layout.component';
import { CommissionsPage } from './pages/commissions/commissions-page.component';
import { CommissionsInitialPage } from './pages/commissions/pages/initial-page/commissions-initial-page.component';
import { MonthlyStatementPage } from './pages/commissions/pages/monthly-summary/monthly-summary-page.component';
import { ContentsManagementPage } from './pages/contents-management/contents-management-page.component';
import { AnnouncementsManagementPage } from './pages/contents-management/pages/announcements-management/announcements-management-page.component';
import { ConvocationsManagementPage } from './pages/contents-management/pages/convocations-management/convocations-management-page.component';
import { EditCoordinatorPage } from './pages/contents-management/pages/coordinators-group-management/components/edit-coordinator/edit-coordinator.component';
import { CoordinatorsGroupManagementPage } from './pages/contents-management/pages/coordinators-group-management/coordinators-management-page.component';
import { EventsManagementPage } from './pages/contents-management/pages/events-management/events-management-page.component';
import { EditFacilitatorPage } from './pages/contents-management/pages/facilitators-group-management/components/edit-facilitator/edit-facilitator.component';
import { FacilitatorsGroupManagementPage } from './pages/contents-management/pages/facilitators-group-management/facilitators-management-page.component';
import { MembersMapManagementPage } from './pages/contents-management/pages/members-map-management/members-map-management-page.component';
import { MemoriesManagementPage } from './pages/contents-management/pages/memories-management/memories-management-page.component';
import { NCPManagementPage } from './pages/contents-management/pages/ncp-management/ncp-management-page.component';
import { NewsManagementPage } from './pages/contents-management/pages/news-management/news-management-page.component';
import { NewsletterManagementPage } from './pages/contents-management/pages/newsletter-management/newsletter-management-page.component';
import { PublicationsManagementPage } from './pages/contents-management/pages/publications-management/publications-management-page.component';
import { SupportersManagementPage } from './pages/contents-management/pages/supporters-management/supporters-management-page.component';
import { GlobalIntranetSearchPage } from './pages/global-search/global-search-page.component';
import { HomePage } from './pages/home/home-page.component';
import { LinkingPage } from './pages/linking/linking-page.component';
import { MinutesPage } from './pages/minutes/minutes-page.component';
import { CommissionsMinutesManagementPage } from './pages/minutes/pages/commissions-minutes/commissions-minutes-page.component';
import { GroupsMinutesManagementPage } from './pages/minutes/pages/groups-minutes/groups-minutes-page.component';
import { MinutesInitialPage } from './pages/minutes/pages/initial-page/minutes-initial-page.component';
import { NetworkManagementPage } from './pages/net-management/network-management-page.component';
import { ProfileDisablePage } from './pages/profile/pages/profile-disable/profile-disable-page.component';
import { ProfileEditPage } from './pages/profile/pages/profile-edit/profile-edit-page.component';
import { ProfilePage } from './pages/profile/profile-page.component';
import { ProjectsPage } from './pages/projects/projects-page.component';
import { UsersManagementPage } from './pages/users-management/users-management-page.component';
import { ScientificEcosystemManagementPage } from './pages/contents-management/pages/scientific-ecosystem-management/scientific-ecosystem-management-page.component';

const intranetRoutes: Routes = [
  {
    path: '',
    component: IntranetLayoutPage,
    canActivate: [rolesGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomePage,
      },
      {
        path: 'busqueda-global',
        component: GlobalIntranetSearchPage,
      },
      {
        path: 'perfil',
        component: ProfilePage,
        data: {
          roles: [
            Role.ROLE_SUPER_ADMIN,
            Role.ROLE_LINKED,
            Role.ROLE_REGISTERED,
            Role.ROLE_COORDINATOR,
            Role.ROLE_FACILITATOR,
            Role.ROLE_OPERATIONAL_COORDINATOR,
          ],
        },
      },
      {
        path: 'perfil/editar',
        component: ProfileEditPage,
        data: {
          roles: [
            Role.ROLE_SUPER_ADMIN,
            Role.ROLE_LINKED,
            Role.ROLE_COORDINATOR,
            Role.ROLE_FACILITATOR,
            Role.ROLE_REGISTERED,
            Role.ROLE_OPERATIONAL_COORDINATOR,
          ],
        },
      },
      {
        path: 'vinculacion',
        component: LinkingPage,
        data: {
          roles: [
            Role.ROLE_SUPER_ADMIN,
            Role.ROLE_LINKED,
            Role.ROLE_COORDINATOR,
            Role.ROLE_FACILITATOR,
            Role.ROLE_REGISTERED,
            Role.ROLE_OPERATIONAL_COORDINATOR,
          ],
        },
      },
      {
        path: 'actas',
        component: MinutesPage,
        children: [
          {
            path: 'grupo-coordinador', // creacion: GRUPO FACILITADOR, aprobación: GRUPO COORDINADOR
            component: GroupsMinutesManagementPage,
          },
          {
            path: 'grupo-facilitador', // Creacion: ADMIN, aprobacion: GRUPO FACILITADOR
            component: GroupsMinutesManagementPage,
          },
          {
            path: 'comisiones', // Creación: GRUPO FACILITADOR, aprobación: TODOS
            component: CommissionsMinutesManagementPage,
          },
          {
            path: '**',
            component: MinutesInitialPage,
          },
        ],
        data: {
          roles: [
            Role.ROLE_SUPER_ADMIN,
            Role.ROLE_LINKED,
            Role.ROLE_COORDINATOR,
            Role.ROLE_FACILITATOR,
            Role.ROLE_OPERATIONAL_COORDINATOR,
          ],
        },
      },
      {
        path: 'proyectos',
        component: ProjectsPage,
        data: {
          roles: [
            Role.ROLE_SUPER_ADMIN,
            Role.ROLE_LINKED,
            Role.ROLE_COORDINATOR,
            Role.ROLE_FACILITATOR,
            Role.ROLE_OPERATIONAL_COORDINATOR,
          ],
        },
      },
      {
        path: 'comisiones',
        component: CommissionsPage,
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: CommissionsInitialPage,
          },
          {
            path: ':name',
            component: MonthlyStatementPage,
          },
        ],
        data: {
          roles: [
            Role.ROLE_SUPER_ADMIN,
            Role.ROLE_FACILITATOR,
            Role.ROLE_OPERATIONAL_COORDINATOR,
          ],
        },
      },
      {
        path: 'gestion-red',
        component: NetworkManagementPage,
        data: {
          roles: [Role.ROLE_SUPER_ADMIN, Role.ROLE_OPERATIONAL_COORDINATOR],
        },
      },
      {
        path: 'convocatorias',
        component: ConvocationsPage,
      },
      {
        path: 'convocatorias/:urlName',
        component: ConvocationDetailPage,
      },
      {
        path: 'usuarios',
        component: UsersManagementPage,
        data: {
          roles: [Role.ROLE_SUPER_ADMIN, Role.ROLE_OPERATIONAL_COORDINATOR],
        },
      },
      {
        path: 'gestion-contenido',
        component: ContentsManagementPage,
        data: { roles: [Role.ROLE_SUPER_ADMIN] },
      },
      {
        path: 'gestion-contenido/comunicados',
        component: AnnouncementsManagementPage,
        data: { roles: [Role.ROLE_SUPER_ADMIN] },
      },
      {
        path: 'gestion-contenido/eventos',
        component: EventsManagementPage,
        data: { roles: [Role.ROLE_SUPER_ADMIN] },
      },
      {
        path: 'gestion-contenido/noticias',
        component: NewsManagementPage,
        data: { roles: [Role.ROLE_SUPER_ADMIN] },
      },
      {
        path: 'gestion-contenido/convocatorias',
        component: ConvocationsManagementPage,
        data: { roles: [Role.ROLE_SUPER_ADMIN] },
      },
      {
        path: 'gestion-contenido/grupo-coordinador',
        component: CoordinatorsGroupManagementPage,
        data: { roles: [Role.ROLE_SUPER_ADMIN] },
      },
      {
        path: 'gestion-contenido/grupo-coordinador/editar/:id',
        component: EditCoordinatorPage,
        data: { roles: [Role.ROLE_SUPER_ADMIN] },
      },
      {
        path: 'gestion-contenido/grupo-facilitador',
        component: FacilitatorsGroupManagementPage,
        data: { roles: [Role.ROLE_SUPER_ADMIN] },
      },
      {
        path: 'gestion-contenido/grupo-facilitador/editar/:id',
        component: EditFacilitatorPage,
        data: { roles: [Role.ROLE_SUPER_ADMIN] },
      },
      {
        path: 'gestion-contenido/mapa',
        component: MembersMapManagementPage,
        data: { roles: [Role.ROLE_SUPER_ADMIN] },
      },
      {
        path: 'gestion-contenido/colaboradores',
        component: SupportersManagementPage,
        data: { roles: [Role.ROLE_SUPER_ADMIN] },
      },
      {
        path: 'gestion-contenido/ncp',
        component: NCPManagementPage,
        data: { roles: [Role.ROLE_SUPER_ADMIN] },
      },
      {
        path: 'gestion-contenido/publicaciones',
        component: PublicationsManagementPage,
        data: { roles: [Role.ROLE_SUPER_ADMIN] },
      },
      {
        path: 'gestion-contenido/publicaciones/editar/:urlName',
        component: PublicationsManagementPage,
        data: { roles: [Role.ROLE_SUPER_ADMIN] },
      },
      {
        path: 'gestion-contenido/boletin-noticias',
        component: NewsletterManagementPage,
        data: { roles: [Role.ROLE_SUPER_ADMIN] },
      },
      {
        path: 'gestion-contenido/memorias',
        component: MemoriesManagementPage,
        data: { roles: [Role.ROLE_SUPER_ADMIN] },
      },
      {
        path: 'gestion-contenido/ecosistema-cientifico',
        component: ScientificEcosystemManagementPage,
        data: { roles: [Role.ROLE_SUPER_ADMIN] },
      },
      {
        path: 'eventos',
        component: EventsPage,
      },
      {
        path: 'eventos/:urlName',
        component: EventDetailPage,
      },
      {
        path: 'noticias',
        component: NewsPage,
      },
      {
        path: 'noticias/:urlName',
        component: NewsDetailPage,
      },
      {
        path: 'convocatorias',
        component: ConvocationsPage,
      },
      {
        path: 'publicaciones/:urlName',
        component: PublicationDetailPage,
      },
    ],
  },
  {
    path: 'retiro',
    component: ProfileDisablePage,
    data: {
      roles: [
        Role.ROLE_LINKED,
        Role.ROLE_REGISTERED,
        Role.ROLE_COORDINATOR,
        Role.ROLE_FACILITATOR,
        Role.ROLE_OPERATIONAL_COORDINATOR,
      ],
    },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
export default intranetRoutes;
