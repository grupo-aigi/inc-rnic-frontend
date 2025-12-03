import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Observable, lastValueFrom } from 'rxjs';

import { AuthService } from '../../../../../../../../services/auth/auth.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import {
  CommissionDetail,
  CommissionMonthlyMembers,
} from '../../../../../../../../services/intranet/commissions/commissions.interfaces';
import { CommissionsService } from '../../../../../../../../services/intranet/commissions/commissions.service';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { CommissionMemberListComponent } from '../commission-member-list/commission-member-list.component';
import labels from './commission-monthly-members.lang';

@Component({
  standalone: true,
  selector: 'app-commission-monthly-members',
  templateUrl: './commission-monthly-members.component.html',
  imports: [CommonModule, CommissionMemberListComponent],
})
export class CommissionMonthlyMembersComponent {
  @Input() public year!: number;
  @Input() public activeCommission!: CommissionDetail;
  @Input() public activeSearch$!: Observable<{
    filter: boolean;
    value: string;
  }>;
  public filteredCommissionMonthlyMembers: CommissionMonthlyMembers[] = [];
  public months: { id: number; en: string; es: string }[] = [
    {
      id: 1,
      en: 'JANUARY',
      es: 'ENERO',
    },
    {
      id: 2,
      en: 'FEBRUARY',
      es: 'FEBRERO',
    },
    {
      id: 3,
      en: 'MARCH',
      es: 'MARZO',
    },
    {
      id: 4,
      en: 'APRIL',
      es: 'ABRIL',
    },
    {
      id: 5,
      en: 'MAY',
      es: 'MAYO',
    },
    {
      id: 6,
      en: 'JUNE',
      es: 'JUNIO',
    },
    {
      id: 7,
      en: 'JULY',
      es: 'JULIO',
    },
    {
      id: 8,
      en: 'AUGUST',
      es: 'AGOSTO',
    },
    {
      id: 9,
      en: 'SEPTEMBER',
      es: 'SEPTIEMBRE',
    },
    {
      id: 10,
      en: 'OCTOBER',
      es: 'OCTUBRE',
    },
    {
      id: 11,
      en: 'NOVEMBER',
      es: 'NOVIEMBRE',
    },
    {
      id: 12,
      en: 'DECEMBER',
      es: 'DICIEMBRE',
    },
  ];
  public activeMonths: number[] = [];
  public loadingMembers: boolean = false;

  public monthlySummaries: CommissionMonthlyMembers[] = [];

  public constructor(
    private resourcesService: ResourcesService,
    private commissionsService: CommissionsService,
    private authService: AuthService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.loadingMembers = true;
    this.commissionsService
      .fetchMembersOfCommissionByYear(this.activeCommission.value, this.year)
      .subscribe({
        next: (months) => {
          this.monthlySummaries = months;
          this.filteredCommissionMonthlyMembers = months;
          this.subscribeToSearchChanges();
          const uniqueUsersIds = months
            .flatMap(({ usersInfo }) => usersInfo)
            .map(({ id }) => id);
          this.fetchUserAvatars(uniqueUsersIds);
        },
      });
  }

  private subscribeToSearchChanges() {
    this.activeSearch$.subscribe(({ filter, value }) => {
      if (!filter) {
        this.activeMonths = [];
        this.filteredCommissionMonthlyMembers = this.monthlySummaries;
        return;
      }
      this.activeMonths = this.monthlySummaries.map(({ month }) => month);
      this.filteredCommissionMonthlyMembers = this.monthlySummaries.map(
        ({ month, usersInfo }) => {
          return {
            month,
            usersInfo: usersInfo.filter(({ name }) =>
              name?.toLowerCase().includes(value.toLowerCase()),
            ),
          };
        },
      );
    });
  }

  private fetchUserAvatars(usersIds: string[]) {
    return Promise.all(
      usersIds.map((id) =>
        lastValueFrom(this.resourcesService.getUserAvatarImageByUserId(id))
          .then((blob) => ({ id, content: blob }))
          .then(({ id, content }) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              let browserUrl = '';
              if (content.size > 0) {
                browserUrl = reader.result as string;
              }
              this.monthlySummaries = this.monthlySummaries.map(
                (monthlySummary) => {
                  return {
                    ...monthlySummary,
                    usersInfo: monthlySummary.usersInfo.map((userInfo) => {
                      if (userInfo.id === id) {
                        return {
                          ...userInfo,
                          browserUrl,
                        };
                      }
                      return userInfo;
                    }),
                  };
                },
              );
            };
            reader.readAsDataURL(content);
          }),
      ),
    ).finally(() => {
      this.loadingMembers = false;
    });
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public isMonthActive(monthId: number): boolean {
    return this.activeMonths.includes(monthId);
  }

  public getMonthLabel(month: number) {
    return this.months.find((m) => m.id === month)![this.lang];
  }

  public handleToggleMonth(monthId: number) {
    if (this.isMonthActive(monthId)) {
      this.activeMonths = this.activeMonths.filter((y) => y !== monthId);
    } else {
      this.activeMonths.push(monthId);
    }
  }
}
