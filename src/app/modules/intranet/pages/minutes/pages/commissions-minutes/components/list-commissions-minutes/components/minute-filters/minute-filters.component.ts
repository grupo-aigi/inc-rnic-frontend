import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { formatDate } from '../../../../../../../../../../helpers/date-formatters';
import filterFalsyValues from '../../../../../../../../../../helpers/object-utils';
import commissions from '../../../../../../../../../../services/intranet/commissions/commissions.data';
import { Commissions } from '../../../../../../../../../../services/intranet/commissions/commissions.interfaces';
import { CommissionMinutesService } from '../../../../../../../../../../services/intranet/minutes/commission-minute.service';
import {
  CommissionMinuteSearchRecommendation,
  CommissionMinutesFilterCriteria,
} from '../../../../../../../../../../services/intranet/minutes/minutes.interfaces';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import labels from './minute-filters.lang';

@Component({
  standalone: true,
  selector: 'app-commission-minutes-filter',
  templateUrl: './minute-filters.component.html',
  imports: [CommonModule, FormsModule, RouterModule],
})
export class CommissionMinutesFilterComponent implements OnInit {
  @Output() onFiltersChange: EventEmitter<CommissionMinutesFilterCriteria> =
    new EventEmitter();
  public searchDebounce: Subject<string> = new Subject();
  public displaySearchOptions: boolean = false;
  public filterCriteria!: CommissionMinutesFilterCriteria;
  public showFiltersButton: boolean = true;
  public isFirstTime: boolean = true;

  public recommendedOptions: CommissionMinuteSearchRecommendation[] = [];
  public showInvalidDatesAlert: boolean = false;
  public loadingRecommendations: boolean = false;
  public selectedCategoryId?: number;

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private langService: LangService,
    private commissionMinutesService: CommissionMinutesService,
  ) {}

  public ngOnInit(): void {
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
      this.commissionMinutesService
        .fetchAllCommissionMinutesSearchRecommendations(searchTerm)
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

  public get commissions() {
    return commissions;
  }

  public getInfoByCommission(commission: Commissions) {
    return commissions.find((c) => c.value === commission)?.logo;
  }

  private getQueryFilters(params: Params) {
    const queryUrlFilters: CommissionMinutesFilterCriteria = {};

    if (params['busqueda']) queryUrlFilters.busqueda = params['busqueda'];

    if (params['comision']) {
      this.showFiltersButton = false;
      queryUrlFilters.comision = params['comision'] as Commissions;
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

  private initInputs(queryFilters: CommissionMinutesFilterCriteria) {
    this.filterCriteria = queryFilters;
    if (queryFilters.busqueda)
      this.filterCriteria.busqueda = queryFilters.busqueda;

    if (queryFilters.comision)
      this.filterCriteria.comision = queryFilters.comision;

    if (queryFilters.desde) this.filterCriteria.desde = queryFilters.desde;

    if (queryFilters.hasta) this.filterCriteria.hasta = queryFilters.hasta;
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
      return this.executeFilters();
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
      comision: this.filterCriteria.comision,
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
