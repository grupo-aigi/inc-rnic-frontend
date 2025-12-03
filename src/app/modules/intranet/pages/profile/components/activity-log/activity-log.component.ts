import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import commissions from '../../../../../../services/intranet/commissions/commissions.data';
import {
  ActivityItem,
  ActivityLogType,
} from '../../../../../../services/intranet/user/activity-log.interfaces';
import { ActivityLogService } from '../../../../../../services/intranet/user/activity-log.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './activity-log.lang';

const icons = {
  [ActivityLogType.REGISTER]: 'bx bx-user-plus',
  [ActivityLogType.LINKED]: 'bx bx-user-check',
  [ActivityLogType.COMMISSIONS_CHANGED]: 'bx bx-sync',
  [ActivityLogType.BLOCKED]: 'bx bx-user-x',
  [ActivityLogType.UNBLOCKED]: 'bx bx-user-plus',
};

const iconColors = {
  [ActivityLogType.REGISTER]: 'primary',
  [ActivityLogType.LINKED]: 'success',
  [ActivityLogType.COMMISSIONS_CHANGED]: 'warning',
  [ActivityLogType.BLOCKED]: 'danger',
  [ActivityLogType.UNBLOCKED]: 'success',
};

@Component({
  standalone: true,
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  imports: [CommonModule],
})
export class ActivityLogComponent implements OnInit {
  public page = 0;
  public size = 10;
  public loading = false;
  public totalItems: number = 0;

  public activityLogs: ActivityItem[] = [];

  public constructor(
    private langService: LangService,
    private activityLogService: ActivityLogService,
  ) {}

  public ngOnInit(): void {
    this.fetchActivityLogs();
    this.fetchActivityLogsCount();
  }

  public loadMoreLogs() {
    this.page++;
    this.fetchActivityLogs();
  }

  private fetchActivityLogs() {
    this.loading = true;
    this.activityLogService
      .fetchActivityLog(this.page, this.size)
      .subscribe({
        next: (activityLogs) => {
          this.activityLogs = [...this.activityLogs, ...activityLogs];
        },
        error: (error) => {
          console.error('Error fetching activity logs', error);
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  private fetchActivityLogsCount() {
    this.activityLogService.countActivityLog().subscribe({
      next: ({ count }) => {
        this.totalItems = count;
      },
      error: (error) => {
        console.error('Error fetching activity logs count', error);
      },
    });
  }
  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public get commissions() {
    return commissions;
  }

  public getLogValue(type: ActivityLogType, field: 'title' | 'description') {
    return this.labels[type][field][this.lang];
  }

  public getIconByType(type: ActivityLogType) {
    return icons[type];
  }

  public getIconColorByType(type: ActivityLogType) {
    return iconColors[type];
  }

  public getCommissionLabel(commission: string) {
    return this.commissions.find(({ value }) => value === commission)?.label[
      this.lang
    ];
  }

  public getCommissionsList(text: string) {
    return text
      .split(',')
      .map((commission) => commission.trim())
      .map((commission) => this.getCommissionLabel(commission))
      .filter((commission) => commission)
      .map((commission) => commission!);
  }

  public getFormattedDate(date: Date): string {
    const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
    const parsedDate = new Date(
      new Date(date).getTime() + timezoneOffsetInMinutes * 60 * 1000,
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
