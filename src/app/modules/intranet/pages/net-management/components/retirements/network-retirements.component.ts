
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import {
  NetworkRetirement,
  RetirementFilterCriteria,
} from '../../../../../../services/intranet/net-management/net-management.interfaces';
import { NetworkManagementService } from '../../../../../../services/intranet/net-management/net-management.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { AppPagination } from '../../../../../../services/shared/misc/pagination.interfaces';
import { CompletePaginationComponent } from '../../../../../landing/components/pagination/complete-pagination/complete-pagination.component';
import { RetirementItemComponent } from './components/retirement-item/retirement-item.component';
import { RetirementsFilterComponent } from './components/retirements-filters/retirements-filters.component';
import labels from './network-retirements.lang';

@Component({
  standalone: true,
  selector: 'app-network-retirements',
  templateUrl: './network-retirements.component.html',
  imports: [
    RetirementsFilterComponent,
    RetirementItemComponent,
    CompletePaginationComponent
],
})
export class NetworkRetirementsComponent implements OnInit {
  public filters: RetirementFilterCriteria = {};
  public retirements: NetworkRetirement[] = [];
  public pagination: AppPagination = {
    totalElements: 0,
    pageSize: 10,
    currentPage: 1,
  };

  public constructor(
    private router: Router,
    private langService: LangService,
    private toastService: ToastrService,
    private networkManagementService: NetworkManagementService,
  ) {}

  public ngOnInit(): void {
    this.fetchRetirements();
  }

  private fetchRetirements() {
    return this.networkManagementService
      .fetchRetirements(
        {
          pagina: this.pagination.currentPage - 1,
          cantidad: this.pagination.pageSize,
        },
        this.filters,
      )
      .then(({ records, count }) => {
        this.pagination.totalElements = count;
        this.retirements = records;
      })
      .catch((error) => {
        this.toastService.error(labels.errorFetchingRetirements[this.lang]);
      });
  }

  public handleRetirementConfirmed(retirement: NetworkRetirement) {
    this.retirements = this.retirements.filter(
      (r) => r.userId !== retirement.userId,
    );
  }

  public handleRetirementDenied(retirement: NetworkRetirement) {
    this.retirements = this.retirements.filter(
      (r) => r.userId !== retirement.userId,
    );
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleUpdateFilters(filters: RetirementFilterCriteria) {
    this.filters = filters;
    this.pagination.currentPage = 1;
    this.fetchRetirements();
  }

  public handleGoToPage(page: number) {
    this.pagination.currentPage = page;
    this.router.navigate(['/gestion-red'], {
      fragment: 'top',
      queryParams: { pagina: page },
      queryParamsHandling: 'merge',
    });
  }

  public formatCardDate(timestamp: number): string {
    const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
    const parsedDate = new Date(
      timestamp + timezoneOffsetInMinutes * 60 * 1000,
    );
    const navigatorLanguage = window.navigator.language || 'en-US';
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    return parsedDate.toLocaleDateString(navigatorLanguage, options);
  }
}
