import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { formatDate } from '../../../../../../helpers/date-formatters';
import filterFalsyValues from '../../../../../../helpers/object-utils';
import {
  EventCategory,
  EventFilterCriteria,
  EventSearchRecommendation,
  EventTag,
} from '../../../../../../services/landing/event/event.interfaces';
import { EventService } from '../../../../../../services/landing/event/event.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './events-filter.lang';

@Component({
  standalone: true,
  selector: 'app-events-filter',
  templateUrl: './events-filter.component.html',
  imports: [FormsModule, CommonModule],
})
export class EventsFilterComponent implements OnInit {
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  @Output() public onFiltersChange: EventEmitter<EventFilterCriteria> =
    new EventEmitter();
  public filterCriteria: EventFilterCriteria = {};
  public searchDebounce: Subject<string> = new Subject();
  public displaySearchOptions: boolean = false;
  public showFiltersButton: boolean = true;
  public eventCategories: EventCategory[] = [];
  public allTags: EventTag[] = [];
  public allEventTypes: { id: number; es: string; en: string }[] = [];
  public recommendedOptions: EventSearchRecommendation[] = [];
  public showInvalidDatesAlert: boolean = false;
  public loadingRecommendations: boolean = false;
  public isFirstTime: boolean = true;

  public constructor(
    private eventService: EventService,
    private langService: LangService,
    private route: ActivatedRoute,
    private router: Router,
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
      this.eventService
        .fetchAllEventSearchRecommendations(searchTerm)
        .subscribe((recommendations) => {
          this.loadingRecommendations = false;
          this.recommendedOptions = recommendations;
        });
    });

    this.eventService.fetchCategories().subscribe((categories) => {
      this.eventCategories = categories.sort((a, b) => a.id - b.id);
    });
    this.eventService.fetchTags().subscribe((tags) => {
      this.allTags = tags;
    });
    this.eventService.fetchEventTypes().subscribe((types) => {
      this.allEventTypes = types;
    });
  }

  private initInputs(queryFilters: EventFilterCriteria) {
    this.filterCriteria = queryFilters;
    if (queryFilters.busqueda)
      this.filterCriteria.busqueda = queryFilters.busqueda;

    if (queryFilters.categoriaId)
      this.filterCriteria.categoriaId = queryFilters.categoriaId;

    if (queryFilters.etiquetaId)
      this.filterCriteria.etiquetaId = queryFilters.etiquetaId;

    if (queryFilters.desde) this.filterCriteria.desde = queryFilters.desde;

    if (queryFilters.hasta) this.filterCriteria.hasta = queryFilters.hasta;

    if (queryFilters.tipo) this.filterCriteria.tipo = queryFilters.tipo;
  }

  public getTagNameById(tagId: number) {
    const tag = this.allTags.find((tag) => tag.id === tagId);
    if (!tag) return '';
    return tag.name;
  }

  private getQueryFilters(params: Params) {
    const queryUrlFilters: EventFilterCriteria = {};

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
    if (params['tipo']) {
      this.showFiltersButton = false;
      queryUrlFilters.tipo = params['tipo'];
    }
    return queryUrlFilters;
  }

  public isCategorySelected(id: number) {
    return this.filterCriteria.categoriaId === id;
  }

  public handleChangeCategory(category: EventCategory) {
    this.filterCriteria.categoriaId = category.id;
  }

  public handleChangeDate(event: Event, dateType: 'start' | 'end') {
    const { value } = event.target as HTMLInputElement;
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

  public handleClickSearch(event: MouseEvent) {
    event.preventDefault();
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
      tipo: this.filterCriteria.tipo,
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

  public wordToHexColor(word: string) {
    // Calculate a simple hash code for the word
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = word.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert the hash code to a 24-bit hex color
    const color = (hash & 0x00ffffff).toString(16).toUpperCase();

    // Pad the color with zeros if it's less than 6 characters long
    return '#' + '0'.repeat(6 - color.length) + color;
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public formatDate(date: Date): string {
    return formatDate(date, false);
  }
}
