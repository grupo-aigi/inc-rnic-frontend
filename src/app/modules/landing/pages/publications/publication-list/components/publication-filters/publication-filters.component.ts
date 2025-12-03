
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { formatDate } from '../../../../../../../helpers/date-formatters';
import { RecommendedPublication } from '../../../../../../../services/landing/publications/publications.interfaces';
import { PublicationService } from '../../../../../../../services/landing/publications/publications.service';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';
import labels from './publication-filters.lang';

@Component({
  standalone: true,
  selector: 'app-publication-filters',
  templateUrl: './publication-filters.component.html',
  imports: [FormsModule],
})
export class PublicationFiltersComponent implements OnInit {
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  @Output() onFiltersChange: EventEmitter<string> = new EventEmitter();
  public searchDebounce: Subject<string> = new Subject();
  public displaySearchOptions: boolean = false;
  public searchTerm: string = '';
  public recommendedOptions: RecommendedPublication[] = [];
  public loadingRecommendations: boolean = false;
  public isFirstTime: boolean = true;

  public constructor(
    private publicationsService: PublicationService,
    private langService: LangService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    if (location.href.includes('/intranet')) {
      this.variant = 'INTRANET';
    }
    this.route.queryParams.subscribe((params) => {
      this.initInputs(params);
      if (this.isFirstTime) {
        this.onFiltersChange.emit(this.searchTerm);
      } else {
        this.isFirstTime = false;
      }
    });

    this.searchDebounce.pipe(debounceTime(750)).subscribe((searchTerm) => {
      if (!searchTerm) return;
      this.loadingRecommendations = true;
      this.publicationsService
        .fetchAllSearchRecommendations(searchTerm)
        .subscribe((recommendations) => {
          this.recommendedOptions = recommendations;
          this.loadingRecommendations = false;
        });
    });
  }

  private initInputs(params: Params) {
    this.searchTerm = params['busqueda'] || '';
  }

  public handleClearSearch(event: MouseEvent) {
    this.searchTerm = '';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { busqueda: null },
    });
    this.onFiltersChange.emit('');
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

    // Verify relatedTarget is an anchor element
    const anchorElement = relatedTarget as HTMLAnchorElement;
    const isRecommendation = anchorElement.classList.contains(
      'recommendation-item',
    );
    if (!isRecommendation) return;
    window.open(anchorElement.href, '_blank');
  }

  public handleClickSearch(event: MouseEvent) {
    event.preventDefault();
    this.searchTerm = '';
    this.displaySearchOptions = false;
  }

  public async handleSearchByTerm($event: KeyboardEvent) {
    if ($event.key === 'Escape') {
      this.displaySearchOptions = false;
      return;
    } else if ($event.key === 'Enter') {
      this.displaySearchOptions = false;
      return this.executeFilters();
    }
    this.searchDebounce.next(this.searchTerm);
  }

  public executeFilters() {
    this.onFiltersChange.emit(this.searchTerm);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { busqueda: this.searchTerm },
      queryParamsHandling: 'merge',
    });
  }

  public handleOpenOptions(event: MouseEvent) {
    event.preventDefault();
    this.displaySearchOptions = true;
    this.searchDebounce.next(this.searchTerm);
  }

  public formatPublicationDate(date: Date): string {
    return formatDate(date);
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  handleSubmit() {}
}
