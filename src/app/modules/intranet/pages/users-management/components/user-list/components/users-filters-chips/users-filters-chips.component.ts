
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import commissions from '../../../../../../../../services/intranet/commissions/commissions.data';
import { Commissions } from '../../../../../../../../services/intranet/commissions/commissions.interfaces';
import {
  Role,
  UsersFilterCriteria,
} from '../../../../../../../../services/intranet/user/user.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './users-filters-chips.lang';
import { roles } from '../../../../../../../../services/intranet/user/user.data';

@Component({
  standalone: true,
  selector: 'app-users-filters-chips',
  templateUrl: './users-filters-chips.component.html',
  imports: [],
})
export class UsersFiltersChipsComponent implements OnInit {
  @Input() filterCriteria!: UsersFilterCriteria;
  @Output() public onChange: EventEmitter<void> = new EventEmitter();

  public constructor(private langService: LangService) {}

  public ngOnInit(): void {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public get commissions() {
    return commissions;
  }

  public get roles() {
    return roles;
  }

  public handleUpdateActiveRole(role: Role) {
    if (role === this.filterCriteria.role) {
      return;
    }
    this.filterCriteria.role = role;
    this.onChange.emit();
  }

  public handleUpdateActiveCommission(commission: Commissions) {
    if (commission === this.filterCriteria.commission) {
      return;
    }
    this.filterCriteria.commission = commission;
    this.onChange.emit();
  }
}
