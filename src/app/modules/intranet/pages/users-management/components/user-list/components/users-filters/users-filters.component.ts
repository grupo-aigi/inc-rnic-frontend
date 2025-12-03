
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Commissions } from '../../../../../../../../services/intranet/commissions/commissions.interfaces';
import {
  Role,
  UsersFilterCriteria,
  UsersSearchRecommendation,
} from '../../../../../../../../services/intranet/user/user.interfaces';
import { UsersService } from '../../../../../../../../services/intranet/user/user.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { UsersFiltersChipsComponent } from '../users-filters-chips/users-filters-chips.component';
import { UsersFiltersRecommendationsComponent } from '../users-filters-recommendations/users-filters-recommendations.component';
import { UsersFiltersResetComponent } from '../users-filters-reset/users-filters-reset.component';
import labels from './users-filters.lang';

@Component({
  standalone: true,
  selector: 'app-users-filters',
  templateUrl: './users-filters.component.html',
  imports: [
    FormsModule,
    UsersFiltersResetComponent,
    UsersFiltersChipsComponent,
    UsersFiltersRecommendationsComponent
],
})
export class UsersFilterComponent implements OnInit {
  @Output() onExecuteFilters: EventEmitter<UsersFilterCriteria> =
    new EventEmitter();
  public searchDebounce: Subject<string> = new Subject();
  public displaySearchOptions: boolean = false;
  public displayResetFiltersButton: boolean = false;
  public filterCriteria: UsersFilterCriteria = {
    search: '',
    role: Role.ALL_ROLES,
    commission: Commissions.TODAS_LAS_COMISIONES,
  };
  public searchTerm: string = '';
  public recommendedOptions: UsersSearchRecommendation[] = [];
  public loadingRecommendations: boolean = false;

  public constructor(
    private usersService: UsersService,
    private router: Router,
    private resourcesService: ResourcesService,
    private toastService: ToastrService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.onExecuteFilters.emit({ ...this.filterCriteria });

    this.searchDebounce.pipe(debounceTime(750)).subscribe((searchTerm) => {
      if (!searchTerm) return;
      this.displayResetFiltersButton = true;
      sessionStorage.setItem('users_search_term', searchTerm);
      this.loadingRecommendations = true;
      this.fetchUsers();
    });
  }

  private fetchUsers() {
    return this.usersService
      .fetchSearchRecommendations(this.searchTerm)
      .subscribe((recommendations) => {
        this.loadingRecommendations = false;
        this.recommendedOptions = recommendations;
        this.fetchUsersAvatars();
      });
  }

  private fetchUsersAvatars() {
    this.recommendedOptions.forEach(({ id, name }) => {
      this.resourcesService.getUserAvatarImageByUserId(id).subscribe({
        next: (value) => {
          if (value.size === 0) {
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            const browserUrl = reader.result as string;
            const user = this.recommendedOptions.find((u) => u.id === id)!;
            user.image = browserUrl;
          };
          reader.readAsDataURL(value);
        },
      });
    });
  }

  public handleUpdateUsers() {
    this.displayResetFiltersButton = true;
    const searchInput = document.querySelector(
      '#users-search-term',
    ) as HTMLInputElement;
    searchInput.focus();
    this.filterCriteria = { ...this.filterCriteria, search: this.searchTerm };
  }

  public handleResetFilters() {
    this.filterCriteria = {
      search: '',
      role: Role.ALL_ROLES,
      commission: Commissions.TODAS_LAS_COMISIONES,
    };
    this.searchTerm = '';
    this.displayResetFiltersButton = false;
    this.onExecuteFilters.emit({ ...this.filterCriteria });
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleCloseSearchOptions(event: FocusEvent) {
    const { relatedTarget } = event;

    if (
      !relatedTarget ||
      !(relatedTarget instanceof HTMLButtonElement) ||
      !relatedTarget.classList.contains('recommendation-chip')
    ) {
      this.displaySearchOptions = false;
      return;
    }
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
    }
    this.filterCriteria = { ...this.filterCriteria, search: this.searchTerm };
    if ($event.key === 'Enter') {
      this.displaySearchOptions = false;
      return this.executeFilters(); // Display all the recommended elements
    }
    this.searchDebounce.next(this.searchTerm);
  }

  private executeFilters() {
    this.onExecuteFilters.emit(this.filterCriteria); // EMIT ACTUAL VALUES
    this.displaySearchOptions = false;
  }

  public handleOpenOptions(event: MouseEvent) {
    event.preventDefault();
    this.displaySearchOptions = true;
  }
}
