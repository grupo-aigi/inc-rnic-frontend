
import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { CommissionMonthlyMembers } from '../../../../../../../../services/intranet/commissions/commissions.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './commission-member-list.lang';

@Component({
  standalone: true,
  selector: 'app-commission-member-list',
  templateUrl: './commission-member-list.component.html',
  imports: [],
})
export class CommissionMemberListComponent implements OnInit {
  @Input() public monthlySummary!: CommissionMonthlyMembers;
  @Input() public activeSearch$!: Observable<{
    filter: boolean;
    value: string;
  }>;

  public filteredMembersInfo: CommissionMonthlyMembers['usersInfo'] = [];

  public constructor(private langService: LangService) {}

  public ngOnInit(): void {
    this.filteredMembersInfo = this.monthlySummary.usersInfo;
  }

  public handleSearch(event: KeyboardEvent) {
    const value = (event.target as HTMLInputElement).value.trim();
    if (!value) {
      this.filteredMembersInfo = this.monthlySummary.usersInfo;
      return;
    }
    this.filteredMembersInfo = this.monthlySummary.usersInfo.filter(
      ({ name }) => name?.toLowerCase().includes(value.toLowerCase()),
    );
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }
}
