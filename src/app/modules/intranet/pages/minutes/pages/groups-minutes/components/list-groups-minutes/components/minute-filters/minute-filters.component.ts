
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { formatDate } from '../../../../../../../../../../helpers/date-formatters';
import filterFalsyValues from '../../../../../../../../../../helpers/object-utils';
import { GroupMinutesService } from '../../../../../../../../../../services/intranet/minutes/group-minute.service';
import {
  GroupMinuteSearchRecommendation,
  GroupMinutesFilterCriteria,
} from '../../../../../../../../../../services/intranet/minutes/minutes.interfaces';
import { networkGroups } from '../../../../../../../../../../services/shared/groups/groups.data';
import { NetworkGroups } from '../../../../../../../../../../services/shared/groups/groups.interfaces';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import labels from './minute-filters.lang';

@Component({
  standalone: true,
  selector: 'app-group-minutes-filter',
  templateUrl: './minute-filters.component.html',
  imports: [FormsModule, RouterModule],
})
export class GroupMinutesFilterComponent implements OnInit {
  @Output() onFiltersChange: EventEmitter<GroupMinutesFilterCriteria> =
    new EventEmitter();
  public searchDebounce: Subject<string> = new Subject();
  public displaySearchOptions: boolean = false;
  public filterCriteria!: GroupMinutesFilterCriteria;
  public showFiltersButton: boolean = true;
  public isFirstTime: boolean = true;

  public recommendedOptions: GroupMinuteSearchRecommendation[] = [];
  public showInvalidDatesAlert: boolean = false;
  public loadingRecommendations: boolean = false;
  public selectedCategoryId?: number;

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private langService: LangService,
    private commissionMinutesService: GroupMinutesService,
  ) {}

  public ngOnInit(): void {
    this.route.url.subscribe((url) => {
      const { path: groupPath } = url[0];

      if (groupPath === 'grupo-coordinador') {
        this.filterCriteria.grupo = networkGroups.find(
          (group) => group.value === NetworkGroups.COORDINATING,
        )?.value;
      } else if (groupPath === 'grupo-facilitador') {
        this.filterCriteria.grupo = networkGroups.find(
          (group) => group.value === NetworkGroups.FACILITATING,
        )?.value;
      } else {
        this.router.navigate(['/intranet/actas']);
        return;
      }
    });

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
        .fetchAllGroupMinutesSearchRecommendations(
          searchTerm,
          this.filterCriteria.grupo!,
        )
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

  public get groups() {
    return networkGroups;
  }

  private getQueryFilters(params: Params) {
    const queryUrlFilters: GroupMinutesFilterCriteria = {};

    if (params['busqueda']) queryUrlFilters.busqueda = params['busqueda'];

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

  private initInputs(queryFilters: GroupMinutesFilterCriteria) {
    this.filterCriteria = queryFilters;
    if (queryFilters.busqueda)
      this.filterCriteria.busqueda = queryFilters.busqueda;

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
      grupo: this.filterCriteria.grupo,
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
