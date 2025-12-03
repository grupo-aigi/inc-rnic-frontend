
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';

import { Commissions } from '../../../../../../services/intranet/commissions/commissions.interfaces';
import {
  Role,
  UserManagement,
  UsersFilterCriteria,
} from '../../../../../../services/intranet/user/user.interfaces';
import { UsersService } from '../../../../../../services/intranet/user/user.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { AppPagination } from '../../../../../../services/shared/misc/pagination.interfaces';
import { CompletePaginationComponent } from '../../../../../landing/components/pagination/complete-pagination/complete-pagination.component';
import { UserCardComponent } from './components/user-card/user-card.component';
import { UsersFilterComponent } from './components/users-filters/users-filters.component';
import labels from './user-list.lang';

@Component({
  standalone: true,
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  imports: [
    UserCardComponent,
    UsersFilterComponent,
    CompletePaginationComponent
],
})
export class UserListComponent {
  public loadingUsers: boolean = false;
  public error: boolean = false;
  public users: UserManagement[] = [];
  public userFilterCriteria: UsersFilterCriteria = {
    commission: Commissions.TODAS_LAS_COMISIONES,
    role: Role.ALL_ROLES,
    search: '',
  };
  public pagination: AppPagination = {
    totalElements: 0,
    pageSize: 25,
    currentPage: 1,
  };

  public constructor(
    private langService: LangService,
    private toastService: ToastrService,
    private userService: UsersService,
    private router: Router,
  ) {}

  public handleUpdateUsers(filterCriteria: UsersFilterCriteria) {
    this.userFilterCriteria = filterCriteria;
    this.fetchUsersInfo();
  }

  private fetchUsersInfo() {
    this.loadingUsers = true;
    this.error = false;
    return lastValueFrom(
      this.userService.fetchUsersInfo(this.userFilterCriteria, {
        pagina: this.pagination.currentPage - 1,
        cantidad: this.pagination.pageSize,
      }),
    )
      .then(({ records, total }) => {
        this.users = records;
        this.pagination.totalElements = total;
      })
      .catch((err) => {
        this.error = true;
        this.toastService.error(labels.errorLoadingUsers[this.lang]);
      })
      .finally(() => {
        this.loadingUsers = false;
      });
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public handleGoToPage(page: number) {
    this.pagination.currentPage = page;
    this.router.navigate(['/intranet/usuarios'], {
      fragment: 'top',
      queryParams: { pagina: page },
      queryParamsHandling: 'merge',
    });
    setTimeout(() => {
      this.fetchUsersInfo();
    }, 1000);
  }
}
