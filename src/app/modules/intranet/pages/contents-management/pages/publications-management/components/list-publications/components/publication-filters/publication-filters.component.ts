
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PublicationService } from '../../../../../../../../../../services/landing/publications/publications.service';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import labels from './publication-filters.lang';
import { RecommendedPublication } from '../../../../../../../../../../services/landing/publications/publications.interfaces';
import { formatDate } from '../../../../../../../../../../helpers/date-formatters';

@Component({
  standalone: true,
  selector: 'app-intranet-publication-filters',
  templateUrl: './publication-filters.component.html',
  imports: [FormsModule],
})
export class IntranetPublicationFilters implements OnInit {
  @Output() onSearchChange: EventEmitter<string> = new EventEmitter();
  public searchDebounce: Subject<string> = new Subject();
  public displaySearchOptions: boolean = false;
  public showFiltersButton: boolean = true;
  public searchTerm: string = '';
  public recommendedOptions: RecommendedPublication[] = [];
  public showInvalidDatesAlert: boolean = false;
  public loadingRecommendations: boolean = false;
  public selectedCategoryId?: number;

  public constructor(
    private publicationsService: PublicationService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.searchTerm = sessionStorage.getItem('publications-search-term') ?? '';

    this.searchDebounce.pipe(debounceTime(750)).subscribe((searchTerm) => {
      if (!searchTerm) return;
      sessionStorage.setItem('publications-search-term', searchTerm);
      this.loadingRecommendations = true;
      this.publicationsService
        .fetchAllSearchRecommendations(searchTerm)
        .subscribe((recommendations) => {
          this.loadingRecommendations = false;
          this.recommendedOptions = recommendations;
        });
    });
  }

  public handleClearSearch(event: MouseEvent) {
    this.searchTerm = '';
    this.onSearchChange.emit('');
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

  public handleClickSearch($event: MouseEvent) {
    $event.preventDefault();
    this.searchTerm = '';
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
    this.searchDebounce.next(this.searchTerm);
  }

  public executeFilters() {
    sessionStorage.setItem('publications-search-term', this.searchTerm);
    this.onSearchChange.emit(this.searchTerm);
    this.displaySearchOptions = false;
  }

  public clearFilters($event: MouseEvent) {
    this.showFiltersButton = true;
    this.selectedCategoryId = undefined;
    this.searchTerm = '';
    this.onSearchChange.emit('');
  }

  public handleOpenOptions(event: MouseEvent) {
    event.preventDefault();
    this.displaySearchOptions = true;
  }

  public formatDate(date: Date): string {
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
