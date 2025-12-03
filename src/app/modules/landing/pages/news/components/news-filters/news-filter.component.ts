import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { formatDate } from '../../../../../../helpers/date-formatters';
import {
  NewsCategory,
  NewsFilterCriteria,
  NewsSearchRecommendation,
  NewsTag,
} from '../../../../../../services/landing/news/news.interfaces';
import { NewsService } from '../../../../../../services/landing/news/news.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './news-filter.lang';
import filterFalsyValues from '../../../../../../helpers/object-utils';

@Component({
  standalone: true,
  selector: 'app-news-filter',
  templateUrl: './news-filter.component.html',
  imports: [CommonModule, FormsModule],
})
export class NewsFilterComponent implements OnInit {
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  @Output() onFiltersChange: EventEmitter<NewsFilterCriteria> =
    new EventEmitter();
  public searchDebounce: Subject<string> = new Subject();
  public displaySearchOptions: boolean = false;
  public filterCriteria!: NewsFilterCriteria;
  public showFiltersButton: boolean = true;
  public newsCategories: NewsCategory[] = [];
  public allTags: NewsTag[] = [];
  public isFirstTime: boolean = true;

  public recommendedOptions: NewsSearchRecommendation[] = [];
  public showInvalidDatesAlert: boolean = false;
  public loadingRecommendations: boolean = false;
  public selectedCategoryId?: number;

  public constructor(
    private newsService: NewsService,
    private router: Router,
    private route: ActivatedRoute,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    if (location.href.includes('/intranet')) {
      this.variant = 'INTRANET';
    }
    this.route.queryParams.subscribe((params) => {
      const queryFilters = this.getQueryFilters(params);
      this.initInputs(queryFilters);
      if (this.isFirstTime) {
        this.onFiltersChange.emit(this.filterCriteria);
      } else {
        this.isFirstTime = false;
      }
    });

    this.searchDebounce.pipe(debounceTime(750)).subscribe((searchTerm) => {
      if (!searchTerm) return;
      this.loadingRecommendations = true;
      this.newsService
        .fetchAllNewsSearchRecommendations(searchTerm)
        .subscribe((recommendations) => {
          this.loadingRecommendations = false;
          this.recommendedOptions = recommendations;
        });
    });

    this.newsService.fetchCategories().subscribe((categories) => {
      this.newsCategories = categories.sort((a, b) => a.id - b.id);
    });
    this.newsService.fetchTags().subscribe((tags) => {
      this.allTags = tags;
    });
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  private getQueryFilters(params: Params) {
    const queryUrlFilters: NewsFilterCriteria = {};

    if (params['busqueda']) queryUrlFilters.busqueda = params['busqueda'];

    if (params['categoriaId']) {
      this.showFiltersButton = false;
      queryUrlFilters.categoriaId = parseInt(params['categoriaId']);
    }
    if (params['etiquetaId']) {
      this.showFiltersButton = false;
      queryUrlFilters.etiquetaId = parseInt(params['etiquetaId']);
    }
    if (params['desde']) {
      this.showFiltersButton = false;
      queryUrlFilters.desde = params['desde'];
    }
    if (params['hasta']) {
      this.showFiltersButton = false;
      queryUrlFilters.hasta = params['hasta'];
    }
    return queryUrlFilters;
  }

  private initInputs(queryFilters: NewsFilterCriteria) {
    this.filterCriteria = queryFilters;
    if (queryFilters.busqueda)
      this.filterCriteria.busqueda = queryFilters.busqueda;

    if (queryFilters.categoriaId)
      this.filterCriteria.categoriaId = queryFilters.categoriaId;

    if (queryFilters.etiquetaId)
      this.filterCriteria.etiquetaId = queryFilters.etiquetaId;

    if (queryFilters.desde) this.filterCriteria.desde = queryFilters.desde;

    if (queryFilters.hasta) this.filterCriteria.hasta = queryFilters.hasta;
  }

  public getTagNameById(tagId: number) {
    const tag = this.allTags.find((tag) => tag.id === tagId);
    if (!tag) return '';
    return tag.name;
  }

  public wordToHexColor(word: string) {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = word.charCodeAt(i) + ((hash << 5) - hash);
    }

    const color = (hash & 0x00ffffff).toString(16).toUpperCase();

    return '#' + '0'.repeat(6 - color.length) + color;
  }

  public handleCloseSearchOptions($event: FocusEvent) {
    const { relatedTarget } = $event;
    if (
      !relatedTarget ||
      !(relatedTarget instanceof HTMLAnchorElement) ||
      !relatedTarget.classList.contains('recommendation-item')
    ) {
      this.displaySearchOptions = false;
      return;
    }

    const anchorElement = relatedTarget as HTMLAnchorElement;
    const isRecommendation = anchorElement.classList.contains(
      'recommendation-item',
    );
    if (!isRecommendation) return;
    window.open(anchorElement.href, '_blank');
  }

  public handleClickSearch($event: MouseEvent) {
    $event.preventDefault();
    this.filterCriteria.busqueda = '';
    this.displaySearchOptions = false;
  }

  public async handleSearchByTerm($event: KeyboardEvent) {
    if ($event.key === 'Escape') {
      this.displaySearchOptions = false;
      return;
    } else if ($event.key === 'Enter') {
      this.displaySearchOptions = false;
      return this.executeFilters(); // Display all the recommended elements
    }
    this.searchDebounce.next(this.filterCriteria.busqueda || '');
  }

  public showFilters() {
    this.showFiltersButton = false;
  }

  public executeFilters() {
    if (this.filterCriteria.desde && this.filterCriteria.hasta) {
      const dateRangeValid =
        new Date(this.filterCriteria.hasta).getTime() >=
        new Date(this.filterCriteria.desde).getTime();
      if (!dateRangeValid) return this.showInvalidDates();
    }

    const filters = {
      busqueda: this.filterCriteria.busqueda,
      categoriaId: this.filterCriteria.categoriaId,
      etiquetaId: this.filterCriteria.etiquetaId,
      desde: this.filterCriteria.desde,
      hasta: this.filterCriteria.hasta,
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: filterFalsyValues(filters),
      queryParamsHandling: 'merge',
    });

    this.onFiltersChange.emit(this.filterCriteria);
    this.displaySearchOptions = false;
  }

  private showInvalidDates() {
    this.showInvalidDatesAlert = true;
    new Promise<void>((resolve) =>
      setTimeout(() => {
        this.showInvalidDatesAlert = false;
        resolve();
      }, 5000),
    );
    return;
  }

  public clearFilters(event: MouseEvent) {
    this.showFiltersButton = true;
    this.filterCriteria = {};
    this.router.navigate([], {
      relativeTo: this.route,
    });
    this.onFiltersChange.emit({});
  }

  public handleOpenOptions(event: MouseEvent) {
    event.preventDefault();
    this.displaySearchOptions = true;
  }

  public formatNewsDate(date: Date): string {
    return formatDate(date);
  }
}
