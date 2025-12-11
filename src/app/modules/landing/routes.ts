import { Routes } from '@angular/router';

import { LandingLayoutPage } from './landing-layout.component';
import { AboutPage } from './pages/about/about-page.component';
import { ConvocationDetailPage } from './pages/convocation-detail/convocation-detail-page.component';
import { ConvocationsPage } from './pages/convocations/convocations-page.component';
import { EventDetailPage } from './pages/event-detail/event-detail-page.component';
import { EventsPage } from './pages/events/events-page.component';
import { GlobalLandingSearchPage } from './pages/global-search/global-search-page.component';
import { HomePage } from './pages/home/home-page.component';
import { MemoriesPage } from './pages/memories/memories-page.component';
import { NationalContactPointPage } from './pages/national-contact-point/national-contact-point-page.component';
import { NetworkGuidelinesPage } from './pages/network-guidelines/network-guidelines-page.component';
import { NewsDetailPage } from './pages/news-detail/news-detail-page.component';
import { NewsPage } from './pages/news/news-page.component';
import { PartnersPage } from './pages/partners/partners-page.component';
import { PublicationDetailPage } from './pages/publications/publication-detail/publication-detail-page.component';
import { PublicationsPage } from './pages/publications/publication-list/publications-page.component';
import { ScientificEcosystemPage } from './pages/scientific-ecosystem/scientific-ecosystem-page.component';
import { TransformativeMissionsPage } from './pages/transformative-missions/transformative-missions-page.component';

const landingRoutes: Routes = [
  {
    path: '',
    component: LandingLayoutPage,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomePage,
      },
      {
        path: 'busqueda-global',
        component: GlobalLandingSearchPage,
      },
      {
        path: 'acerca-de',
        component: AboutPage,
      },
      {
        path: 'eventos',
        component: EventsPage,
      },
      {
        path: 'miembros-red',
        component: PartnersPage,
      },
      {
        path: 'ncp',
        component: NationalContactPointPage,
      },
      {
        path: 'ecosistema/:urlName',
        component: ScientificEcosystemPage,
      },
      {
        path: 'lineamientos',
        component: NetworkGuidelinesPage,
      },
      {
        path: 'misiones-transformativas',
        component: TransformativeMissionsPage,
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
        path: 'convocatorias',
        component: ConvocationsPage,
      },
      {
        path: 'noticias/:urlName',
        component: NewsDetailPage,
      },
      {
        path: 'convocatorias/:urlName',
        component: ConvocationDetailPage,
      },
      {
        path: 'publicaciones',
        component: PublicationsPage,
      },
      {
        path: 'publicaciones/:urlName',
        component: PublicationDetailPage,
      },
      {
        path: 'memorias',
        component: MemoriesPage,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

export default landingRoutes;
