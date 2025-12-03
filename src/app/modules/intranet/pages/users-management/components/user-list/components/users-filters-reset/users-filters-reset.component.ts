
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ReplaceUnderscoresPipe } from '../../../../../../../../pipes/replace-underscore.pipe';
import {
  Role,
  UsersFilterCriteria,
} from '../../../../../../../../services/intranet/user/user.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './users-filters-reset.lang';
import { roles } from '../../../../../../../../services/intranet/user/user.data';
import { Commissions } from '../../../../../../../../services/intranet/commissions/commissions.interfaces';
import commissions from '../../../../../../../../services/intranet/commissions/commissions.data';

@Component({
  standalone: true,
  selector: 'app-users-filters-reset',
  templateUrl: './users-filters-reset.component.html',
  imports: [ReplaceUnderscoresPipe],
})
export class UsersFiltersResetComponent implements OnInit {
  @Input() public filterCriteria!: UsersFilterCriteria;
  @Input() public displayResetFiltersButton!: boolean;
  @Output() public onReset: EventEmitter<void> = new EventEmitter();
  public constructor(private langService: LangService) {}

  public ngOnInit(): void {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public handleResetFilters(event: MouseEvent): void {
    event.preventDefault();
    this.onReset.emit();
  }

  public getRoleName(role: Role): string {
    return roles.find((r) => r.value === role)?.label[this.lang] || '';
  }

  public getCommissionName(commission: Commissions): string {
    return (
      commissions.find((c) => c.value === commission)?.label[this.lang] || ''
    );
  }
}
