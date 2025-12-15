import { Injectable } from '@angular/core';

import { lastValueFrom } from 'rxjs';

import { CommissionMinutesService } from '../../intranet/minutes/commission-minute.service';
import { GroupMinutesService } from '../../intranet/minutes/group-minute.service';
import { ProjectsService } from '../../intranet/projects/projects.service';
import { ConvocationService } from '../../landing/convocation/convocation.service';
import { EventService } from '../../landing/event/event.service';
import { MemoriesService } from '../../landing/memories/memories.service';
import { NewsService } from '../../landing/news/news.service';
import { PublicationService } from '../../landing/publications/publications.service';
import { NetworkGroups } from '../groups/groups.interfaces';
import {
  GlobalSearchRecommendation,
  SearchSection,
  SearchSectionType,
} from './global-search.interfaces';
import { LocalSearchService } from './local-search.service';
import { ScientificEcosystemService } from '../../landing/scientific-ecosystem/scientific-ecosystem.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalSearchService {
  public constructor(
    private projectsService: ProjectsService,
    private groupMinutesService: GroupMinutesService,
    private commissionMinutesService: CommissionMinutesService,
    private eventsService: EventService,
    private newsService: NewsService,
    private convocationService: ConvocationService,
    private publicationService: PublicationService,
    private memoriesService: MemoriesService,
    private localSearchService: LocalSearchService,
    private ecosystemsService: ScientificEcosystemService,
  ) {}

  public fetchLandingRecommendations(
    searchTerm: string,
    enabledSections: SearchSection[],
  ): Promise<GlobalSearchRecommendation[]> {
    return Promise.all([
      this.searchEvents(searchTerm, enabledSections),
      this.searchNews(searchTerm, enabledSections),
      this.searchConvocations(searchTerm, enabledSections),
      this.searchPublications(searchTerm, enabledSections),
      this.searchMemories(searchTerm, enabledSections),
      this.searchEcosystems(searchTerm, enabledSections),
      this.searchLocal(searchTerm, 'LANDING'),
    ]);
  }

  public async fetchIntranetRecommendations(
    searchTerm: string,
    enabledSections: SearchSection[],
  ): Promise<GlobalSearchRecommendation[]> {
    return Promise.all([
      this.searchProjects(searchTerm, enabledSections),
      this.searchMinutes(searchTerm, enabledSections),
      this.searchEvents(searchTerm, enabledSections),
      this.searchNews(searchTerm, enabledSections),
      this.searchConvocations(searchTerm, enabledSections),
      this.searchPublications(searchTerm, enabledSections),
      this.searchEcosystems(searchTerm, enabledSections),
      this.searchLocal(searchTerm, 'INTRANET'),
    ]);
  }

  private searchProjects(
    searchTerm: string,
    enabledSections: SearchSection[],
  ): Promise<GlobalSearchRecommendation> {
    return this.projectsService
      .fetchProjects({ page: 0, size: 10 }, { busqueda: searchTerm })
      .then((projects) =>
        projects.map((project) => ({
          title: project.generalTitle,
          url: `/intranet/proyectos`,
          queryParams: { busqueda: project.id },
          description: project.generalComponents.problem,
          breadCrumbs: [{ es: 'Proyectos', en: 'Projects' }],
          category: project.projectType.projectType,
          createdAt: project.createdAt!,
        })),
      )
      .then((records) => {
        return {
          type: SearchSectionType.PROJECTS,
          records,
        };
      });
  }

  private searchMinutes(
    searchTerm: string,
    enabledSections: SearchSection[],
  ): Promise<GlobalSearchRecommendation> {
    return Promise.all([
      this.fetchCoordinatingGroupMinutes(searchTerm),
      this.fetchFacilitatingGroupMinutes(searchTerm),
      this.fetchCommissionMinutes(searchTerm),
    ]).then(([minutes1, minutes2, minutes3]) => {
      return {
        type: SearchSectionType.MINUTES,
        records: [...minutes1, ...minutes2, ...minutes3],
      };
    });
  }

  private searchEvents(
    searchTerm: string,
    enabledSections: SearchSection[],
  ): Promise<GlobalSearchRecommendation> {
    return this.eventsService
      .fetchEventPosters({ pagina: 0, cantidad: 10 }, { busqueda: searchTerm })
      .then(({ records }) => {
        return records.map((event) => ({
          title: event.title,
          url: `eventos/${event.urlName}`,
          breadCrumbs: [{ es: 'Eventos', en: 'Events' }],
          description: event.description,
          category: event.category.name,
        }));
      })
      .then((records) => {
        return {
          type: SearchSectionType.EVENTS,
          records,
        };
      });
  }

  private searchEcosystems(
    searchTerm: string,
    enabledSections: SearchSection[],
  ): Promise<GlobalSearchRecommendation> {
    return this.ecosystemsService
      .fetchScientificEcosystemPosters()
      .then((res) => {
        return res
          .filter(({ title }) =>
            title.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .map((e) => ({
            title: e.title,
            url: `ecosistema/${e.urlName}`,
            description: '',
            breadCrumbs: [{ es: 'Ecosistema CCR', en: 'CCR Ecosystem' }],
          }));
      })
      .then((records) => {
        return {
          type: SearchSectionType.ECOSYSTEMS,
          records,
        };
      });
  }

  private searchNews(
    searchTerm: string,
    enabledSections: SearchSection[],
  ): Promise<GlobalSearchRecommendation> {
    return this.newsService
      .fetchNewsPosters({ pagina: 0, cantidad: 10 }, { busqueda: searchTerm })
      .then(({ records }) => {
        return records.map((news) => ({
          title: news.title,
          url: `noticias/${news.urlName}`,
          breadCrumbs: [{ es: 'Noticias', en: 'News' }],
          description: news.description,
          createdAt: news.createdAt,
          updatedAt: news.updatedAt,
        }));
      })
      .then((records) => {
        return {
          type: SearchSectionType.NEWS,
          records,
        };
      });
  }

  private searchConvocations(
    searchTerm: string,
    enabledSections: SearchSection[],
  ): Promise<GlobalSearchRecommendation> {
    return this.convocationService
      .fetchConvocationPosters(
        { pagina: 0, cantidad: 10 },
        { busqueda: searchTerm },
      )
      .then(({ records }) => {
        return records.map((convocation) => ({
          title: convocation.title,
          url: `convocatorias/${convocation.urlName}`,
          breadCrumbs: [{ es: 'Convocatorias', en: 'Convocations' }],
          description: convocation.description,
          category: convocation.category.name,
        }));
      })
      .then((records) => {
        return {
          type: SearchSectionType.CONVOCATIONS,
          records,
        };
      });
  }

  private searchPublications(
    searchTerm: string,
    enabledSections: SearchSection[],
  ): Promise<GlobalSearchRecommendation> {
    return lastValueFrom(
      this.publicationService.fetchPublications({
        search: searchTerm,
        page: 0,
        size: 10,
      }),
    )
      .then(({ records }) =>
        records.map((publication) => ({
          title: publication.title,
          description: publication.description,
          url: `publicaciones/${publication.urlName}`,
          breadCrumbs: [{ es: 'Publicaciones', en: 'Publications' }],
          createdAt: publication.createdAt,
          updatedAt: publication.updatedAt,
        })),
      )
      .then((records) => {
        return {
          type: SearchSectionType.PUBLICATIONS,
          records,
        };
      });
  }

  private searchMemories(searchTerm: string, enabledSections: SearchSection[]) {
    return lastValueFrom(
      this.memoriesService.fetchAllSearchRecommendations(searchTerm),
    )
      .then((records) =>
        records.map((memory) => ({
          title: memory.title,
          url: `memorias`,
          queryParams: { busqueda: memory.title },
          breadCrumbs: [{ es: 'Memorias', en: 'Memories' }],
        })),
      )
      .then((memories) => {
        return {
          type: SearchSectionType.MEMORIES,
          records: memories,
        };
      });
  }

  private searchLocal(
    searchTerm: string,
    mode: 'LANDING' | 'INTRANET',
  ): Promise<GlobalSearchRecommendation> {
    return lastValueFrom(
      this.localSearchService.fetchAllSearchRecommendations(searchTerm, mode),
    )
      .then((records) =>
        records.map((record) => ({
          title: record.name,
          url: record.url,
          fragment: record.fragment,
          breadCrumbs: record.breadCrumbs,
        })),
      )
      .then((items) => ({
        type: SearchSectionType[mode],
        records: items,
      }));
  }

  private fetchCoordinatingGroupMinutes(searchTerm: string) {
    return this.groupMinutesService
      .fetchMinutes(
        { pagina: 0, cantidad: 10 },
        { busqueda: searchTerm, grupo: NetworkGroups.COORDINATING },
      )
      .then((minutes) =>
        minutes.items.map((minute) => ({
          title: minute.subject,
          url: `/intranet/actas/grupo-coordinador`,
          queryParams: { busqueda: minute.id },
          breadCrumbs: [
            {
              es: 'Actas del Grupo Coordinador',
              en: 'Coordinating Group Minutes',
            },
          ],
          description: minute.name,
          category: 'Grupo Coordinador',
          createdAt: minute.createdAt!,
        })),
      );
  }

  private fetchFacilitatingGroupMinutes(searchTerm: string) {
    return this.groupMinutesService
      .fetchMinutes(
        { pagina: 0, cantidad: 10 },
        { busqueda: searchTerm, grupo: NetworkGroups.COORDINATING },
      )
      .then((minutes) =>
        minutes.items.map((minute) => ({
          title: minute.subject,
          url: `/intranet/actas/grupo-facilitador`,
          queryParams: { busqueda: minute.id },
          breadCrumbs: [
            {
              es: 'Actas del Grupo Facilitador',
              en: 'Facilitating Group Minutes',
            },
          ],
          description: minute.name,
          category: 'Grupo Facilitador',
          createdAt: minute.createdAt!,
        })),
      );
  }

  private fetchCommissionMinutes(searchTerm: string) {
    return this.commissionMinutesService
      .fetchMinutes({ pagina: 0, cantidad: 10 }, { busqueda: searchTerm })
      .then(({ items, total }) =>
        items.map((minute) => ({
          title: minute.subject,
          url: '/intranet/actas/comisiones',
          queryParams: { busqueda: minute.id },
          breadCrumbs: [{ es: 'Actas por Comisión', en: 'Commission Minutes' }],
          description: minute.name,
          category: 'Comisión',
          createdAt: minute.createdAt!,
        })),
      );
  }
}
