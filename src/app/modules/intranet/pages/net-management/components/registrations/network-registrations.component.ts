
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import {
  NetworkRegistration,
  RegistrationFilterCriteria,
} from '../../../../../../services/intranet/net-management/net-management.interfaces';
import { NetworkManagementService } from '../../../../../../services/intranet/net-management/net-management.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { AppPagination } from '../../../../../../services/shared/misc/pagination.interfaces';
import { CompletePaginationComponent } from '../../../../../landing/components/pagination/complete-pagination/complete-pagination.component';
import { RegistrationItemComponent } from './components/registration-item/registration-item.component';
import { RegistrationsFilterComponent } from './components/registrations-filters/registrations-filters.component';
import labels from './network-registrations.lang';

@Component({
  standalone: true,
  selector: 'app-network-registrations',
  templateUrl: './network-registrations.component.html',
  imports: [
    RegistrationItemComponent,
    CompletePaginationComponent,
    RegistrationsFilterComponent
],
})
export class NetworkRegistrationsComponent implements OnInit {
  public filters: RegistrationFilterCriteria = {};
  public registrations: NetworkRegistration[] = [];
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
    this.fetchRegistrations();
  }

  private fetchRegistrations() {
    return this.networkManagementService
      .fetchRegistrations(
        {
          pagina: this.pagination.currentPage - 1,
          cantidad: this.pagination.pageSize,
        },
        this.filters,
      )
      .then(({ records, count }) => {
        this.pagination.totalElements = count;
        this.registrations = records;
      })
      .catch((error) => {
        this.toastService.error(labels.errorFetchingRegistrations[this.lang]);
      });
  }

  public handleLinkingConfirmed(registration: NetworkRegistration) {
    this.registrations = this.registrations.filter(
      (r) => r.id !== registration.id,
    );
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleUpdateFilters(filters: RegistrationFilterCriteria) {
    this.filters = filters;
    this.pagination.currentPage = 1;
    this.fetchRegistrations();
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
