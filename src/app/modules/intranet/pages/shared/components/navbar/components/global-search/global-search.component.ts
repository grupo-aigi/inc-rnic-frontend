
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Subject, debounceTime } from 'rxjs';

import {
  GlobalSearchRecommendation,
  SearchSection,
  SearchSectionType,
} from '../../../../../../../../services/shared/global-search/global-search.interfaces';
import { GlobalSearchService } from '../../../../../../../../services/shared/global-search/global-search.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './global-search.lang';

@Component({
  standalone: true,
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  imports: [RouterModule, FormsModule],
})
export class GlobalSearchComponent {
  public searchDebounce: Subject<string> = new Subject();
  public displaySearchOptions: boolean = false;
  public showFiltersButton: boolean = true;
  public searchTerm: string = '';
  public recommendedOptions: GlobalSearchRecommendation[] = [];
  public loadingRecommendations: boolean = false;

  public searchSections: SearchSection[] = [
    {
      id: 0,
      type: SearchSectionType.PROJECTS,
      label: { es: 'Proyectos', en: 'Projects' },
      enabled: true,
    },
    {
      id: 1,
      type: SearchSectionType.MINUTES,
      label: { es: 'Actas', en: 'Minutes' },
      enabled: true,
    },
    {
      id: 2,
      type: SearchSectionType.EVENTS,
      label: { es: 'Eventos', en: 'Events' },
      enabled: true,
    },
    {
      id: 3,
      type: SearchSectionType.NEWS,
      label: { es: 'Noticias', en: 'News' },
      enabled: true,
    },
    {
      id: 4,
      type: SearchSectionType.CONVOCATIONS,
      label: { es: 'Convocatorias', en: 'Convocations' },
      enabled: true,
    },
    {
      id: 5,
      type: SearchSectionType.PUBLICATIONS,
      label: { es: 'Publicaciones', en: 'Publications' },
      enabled: true,
    },
  ];

  public constructor(
    private router: Router,
    private langService: LangService,
    private globalSearchService: GlobalSearchService,
  ) {}

  public ngOnInit(): void {
    this.searchDebounce.pipe(debounceTime(750)).subscribe((searchTerm) => {
      if (!searchTerm) {
        this.recommendedOptions = [];
        return;
      }
      this.searchTerm = searchTerm;
      this.loadingRecommendations = true;
      this.fetchActiveSectionsInfo();
    });
  }

  public handleCloseSearchOptions(event: any) {
    const { relatedTarget } = event;
    if (
      !relatedTarget ||
      !(relatedTarget instanceof HTMLElement) ||
      (!relatedTarget.classList.contains('section-chip') &&
        !relatedTarget.classList.contains('recommendation-item'))
    ) {
      this.displaySearchOptions = false;
      return;
    }

    const anchorElement = relatedTarget as HTMLElement;
    const isRecommendation = anchorElement.classList.contains(
      'recommendation-item',
    );
    if (!isRecommendation) return;
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleClickSearch(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/intranet/busqueda-global'], {
      queryParams: { busqueda: this.searchTerm },
    });
    this.searchTerm = '';
    this.displaySearchOptions = false;
  }

  public handleSearchByTerm(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.displaySearchOptions = false;
      return;
    } else if (event.key === 'Enter') {
      this.displaySearchOptions = false;
      return this.executeFilters();
    }
    this.searchDebounce.next(this.searchTerm);
  }

  public showFilters() {
    this.showFiltersButton = false;
  }

  public executeFilters() {
    this.displaySearchOptions = false;
    this.router.navigate(['/intranet/busqueda-global'], {
      queryParams: { busqueda: this.searchTerm },
    });
    this.searchTerm = '';
  }

  public clearFilters() {
    this.showFiltersButton = true;
  }

  public handleOpenOptions(event: MouseEvent) {
    event.preventDefault();
    this.displaySearchOptions = true;
  }

  public async fetchActiveSectionsInfo() {
    const enabledSections = this.searchSections.filter(
      ({ enabled }) => enabled,
    );
    const recommendations =
      await this.globalSearchService.fetchIntranetRecommendations(
        this.searchTerm,
        this.searchSections,
      );

    this.recommendedOptions = recommendations.filter(
      ({ records }) => records.length > 0,
    );
    this.loadingRecommendations = false;
    this.displaySearchOptions = true;
  }
}
