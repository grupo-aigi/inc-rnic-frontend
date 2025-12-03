
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import {
  RegistrationFilterCriteria,
  RegistrationSearchRecommendation,
} from '../../../../../../../../services/intranet/net-management/net-management.interfaces';
import { NetworkManagementService } from '../../../../../../../../services/intranet/net-management/net-management.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { RegistrationsRecommendationsComponent } from '../registrations-recommendations/registrations-recommendations.component';
import labels from './registrations-filters.lang';

@Component({
  standalone: true,
  selector: 'app-registrations-filters',
  templateUrl: './registrations-filters.component.html',
  imports: [FormsModule, RegistrationsRecommendationsComponent],
})
export class RegistrationsFilterComponent implements OnInit {
  @Output() onFiltersChange: EventEmitter<RegistrationFilterCriteria> =
    new EventEmitter();
  public searchDebounce: Subject<string> = new Subject();
  public displaySearchOptions: boolean = false;
  public filterCriteria!: RegistrationFilterCriteria;
  public showFiltersButton: boolean = true;
  public searchTerm: string = '';
  public recommendedOptions: RegistrationSearchRecommendation[] = [];
  public loadingRecommendations: boolean = false;

  public constructor(
    private networkManagementService: NetworkManagementService,
    private router: Router,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    // this.filterCriteria = {
    //   search: sessionStorage.getItem('news-search_term') ?? '',
    //   categoryId: parseInt(sessionStorage.getItem('news-category') || '-1'),

    //   startDate: JSON.parse(
    //     sessionStorage.getItem('news-date_start') ?? '0',
    //   ) as number,
    //   endDate: JSON.parse(
    //     sessionStorage.getItem('news-date_end') ?? '0',
    //   ) as number,
    // };

    this.searchDebounce.pipe(debounceTime(750)).subscribe((searchTerm) => {
      if (!searchTerm) return;
      sessionStorage.setItem('news_search_term', searchTerm);
      // this.filterCriteria = { ...this.filterCriteria, searchTerm: searchTerm };
      // this.onFiltersChange.emit({ ...this.filterCriteria });
      this.loadingRecommendations = true;
      this.networkManagementService
        .fetchAllRegistrationsRecommendations(searchTerm)
        .subscribe((recommendations) => {
          this.loadingRecommendations = false;
          this.recommendedOptions = recommendations;
        });
    });
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
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

  public showFilters(event: MouseEvent) {
    this.showFiltersButton = false;
  }

  public executeFilters() {
    const registrationsFilters: RegistrationFilterCriteria = {};
    if (this.searchTerm) {
      registrationsFilters.search = this.searchTerm;
    }
    this.onFiltersChange.emit(registrationsFilters); // EMIT ACTUAL VALUES
    this.displaySearchOptions = false;
  }

  public clearFilters(event: MouseEvent) {
    event.preventDefault();
    this.showFiltersButton = true;
    this.filterCriteria = {};
    this.onFiltersChange.emit({});
  }

  public handleOpenOptions(event: MouseEvent) {
    event.preventDefault();
    this.displaySearchOptions = true;
  }

  public formatNewsDate(dateString: string): string {
    const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
    const parsedDate = new Date(
      new Date(dateString).getTime() + timezoneOffsetInMinutes * 60 * 1000,
    );

    const navigatorLanguage =
      this.langService.language === 'es' ? 'es-ES' : 'en-US';

    const options: Intl.DateTimeFormatOptions = {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    };
    return parsedDate.toLocaleDateString(navigatorLanguage, options);
  }

  handleSubmit() {}
}
