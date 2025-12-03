
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { debounceTime, Subject } from 'rxjs';

import { GlobalSearchRecommendation } from '../../../../services/shared/global-search/global-search.interfaces';
import { GlobalSearchService } from '../../../../services/shared/global-search/global-search.service';
import { LangService } from '../../../../services/shared/lang/lang.service';
import labels from './global-search-page.lang';
import {
  AppLanguage,
  AppLocale,
} from '../../../../services/shared/lang/lang.interfaces';

@Component({
  standalone: true,
  templateUrl: './global-search-page.component.html',
  imports: [FormsModule, RouterModule],
})
export class GlobalLandingSearchPage implements OnInit {
  public searchDebounce: Subject<string> = new Subject();
  public displaySearchOptions: boolean = false;
  public showFiltersButton: boolean = true;
  public searchTerm: string = '';
  public recommendedOptions: GlobalSearchRecommendation[] = [];
  public loadingRecommendations: boolean = false;

  public constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private langService: LangService,
    private globalSearchService: GlobalSearchService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });

    this.searchDebounce.pipe(debounceTime(750)).subscribe((searchTerm) => {
      if (!searchTerm) {
        return;
      }
      this.searchTerm = searchTerm;
      this.fetchActiveSectionsInfo();
    });

    this.route.queryParams.subscribe((params) => {
      if (params['busqueda']) {
        this.searchTerm = params['busqueda'];
        this.fetchActiveSectionsInfo();
      }
    });
  }

  public async fetchActiveSectionsInfo() {
    const recommendations =
      await this.globalSearchService.fetchLandingRecommendations(
        this.searchTerm,
        [],
      );

    this.recommendedOptions = recommendations.filter(
      ({ records }) => records.length > 0,
    );
    this.loadingRecommendations = false;
    this.displaySearchOptions = true;
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public isMultiLangValue(value: AppLocale | string) {
    return typeof value === 'object';
  }

  public getValueByLang(value: AppLocale | string, lang: AppLanguage) {
    return (value as AppLocale)[lang];
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

  public handleClickSearch(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/busqueda-global'], {
      queryParams: { busqueda: this.searchTerm },
    });
    this.displaySearchOptions = false;
  }

  public handleSearchByTerm(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.displaySearchOptions = false;
      return;
    } else if (event.key === 'Enter') {
      this.displaySearchOptions = false;
      return this.executeFilters();
      // Display all the recommended elements
    }
    this.searchDebounce.next(this.searchTerm);
  }

  public executeFilters() {
    this.displaySearchOptions = false;
    this.router.navigate(['/busqueda-global'], {
      queryParams: { busqueda: this.searchTerm },
    });
  }
}
