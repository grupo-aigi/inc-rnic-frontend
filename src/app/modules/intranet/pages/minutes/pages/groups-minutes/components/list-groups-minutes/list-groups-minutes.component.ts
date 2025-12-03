
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GroupMinutesService } from '../../../../../../../../services/intranet/minutes/group-minute.service';
import {
  GroupMinuteInfo,
  GroupMinutesFilterCriteria,
} from '../../../../../../../../services/intranet/minutes/minutes.interfaces';
import { networkGroups } from '../../../../../../../../services/shared/groups/groups.data';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { AppPagination } from '../../../../../../../../services/shared/misc/pagination.interfaces';
import { CompletePaginationComponent } from '../../../../../../../landing/components/pagination/complete-pagination/complete-pagination.component';
import { GroupMinuteCardComponent } from './components/minute-card/minute-card.component';
import { GroupMinutesFilterComponent } from './components/minute-filters/minute-filters.component';
import { NetworkGroups } from '../../../../../../../../services/shared/groups/groups.interfaces';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-list-group-minutes',
  templateUrl: './list-groups-minutes.component.html',
  imports: [
    CompletePaginationComponent,
    GroupMinuteCardComponent,
    GroupMinutesFilterComponent
],
})
export class GroupsMinutesListComponent implements OnInit {
  public loading: boolean = true;
  public minutes: GroupMinuteInfo[] = [];
  public filterCriteria: GroupMinutesFilterCriteria = {};

  public pagination: AppPagination = {
    totalElements: 0,
    pageSize: 10,
    currentPage: 1,
  };

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private langService: LangService,
    private toastService: ToastrService,
    private groupMinuteService: GroupMinutesService,
  ) {}

  public get lang() {
    return this.langService.language;
  }

  public get groups() {
    return networkGroups;
  }

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
        this.toastService.error('Grupo de trabajo inválido');
        this.router.navigate(['/intranet/actas']);
        return;
      }
      this.fetchGroupMinutes();
    });
  }

  public handleUpdateMinutes(filterCriteria: GroupMinutesFilterCriteria) {
    this.filterCriteria = filterCriteria;
    this.fetchGroupMinutes();
  }

  private fetchGroupMinutes() {
    this.loading = true;
    this.groupMinuteService
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
    this.fetchGroupMinutes();
  }
}
