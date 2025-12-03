import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import commissions from '../../../../../../../../services/intranet/commissions/commissions.data';
import { CommissionMinutesService } from '../../../../../../../../services/intranet/minutes/commission-minute.service';
import {
  CommissionMinuteInfo,
  CommissionMinutesFilterCriteria,
} from '../../../../../../../../services/intranet/minutes/minutes.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { AppPagination } from '../../../../../../../../services/shared/misc/pagination.interfaces';
import { CompletePaginationComponent } from '../../../../../../../landing/components/pagination/complete-pagination/complete-pagination.component';
import { CommissionMinuteCardComponent } from './components/minute-card/minute-card.component';
import { CommissionMinutesFilterComponent } from './components/minute-filters/minute-filters.component';
import { Commissions } from '../../../../../../../../services/intranet/commissions/commissions.interfaces';

@Component({
  standalone: true,
  selector: 'app-list-commission-minutes',
  templateUrl: './list-commissions-minutes.component.html',
  imports: [
    CommonModule,
    CompletePaginationComponent,
    CommissionMinuteCardComponent,
    CommissionMinutesFilterComponent,
  ],
})
export class CommissionsMinutesListComponent implements OnInit {
  public loading: boolean = true;
  public minutes: CommissionMinuteInfo[] = [];
  public filterCriteria: CommissionMinutesFilterCriteria = {};

  public pagination: AppPagination = {
    totalElements: 0,
    pageSize: 10,
    currentPage: 1,
  };

  public constructor(
    private router: Router,
    private langService: LangService,
    private commissionMinuteService: CommissionMinutesService,
  ) {}

  public get lang() {
    return this.langService.language;
  }

  public get commissions() {
    return commissions.filter(
      (commission) => commission.value !== Commissions.TODAS_LAS_COMISIONES,
    );
  }

  public ngOnInit(): void {
    this.fetchCommissionMinutes();
  }

  public handleUpdateMinutes(filterCriteria: CommissionMinutesFilterCriteria) {
    this.filterCriteria = filterCriteria;
    this.fetchCommissionMinutes();
  }

  private fetchCommissionMinutes() {
    this.loading = true;
    this.commissionMinuteService
      .fetchMinutes(
        {
          pagina: this.pagination.currentPage - 1,
          cantidad: this.pagination.pageSize,
        },
        this.filterCriteria,
      )
      .then(({ items, total }) => {
        this.loading = false;
        this.minutes = items.sort(
          (a, b) =>
            new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime(),
        );
        this.pagination.totalElements = total;
      });
  }

  public handleGoToPage(page: number) {
    this.pagination.currentPage = page;
    this.router.navigate(['/intranet/actas/comisiones'], {
      fragment: 'top',
      queryParams: { pagina: page },
      queryParamsHandling: 'merge',
    });
    this.fetchCommissionMinutes();
  }
}
