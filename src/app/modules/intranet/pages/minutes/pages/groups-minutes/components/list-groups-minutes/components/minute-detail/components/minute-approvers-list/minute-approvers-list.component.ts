import { Component, Input, OnInit } from '@angular/core';

import { lastValueFrom } from 'rxjs';

import { formatDate } from '../../../../../../../../../../../../helpers/date-formatters';
import { GroupMinutesService } from '../../../../../../../../../../../../services/intranet/minutes/group-minute.service';
import { MinuteApproval } from '../../../../../../../../../../../../services/intranet/minutes/minutes.interfaces';
import { LangService } from '../../../../../../../../../../../../services/shared/lang/lang.service';
import { AppPagination } from '../../../../../../../../../../../../services/shared/misc/pagination.interfaces';
import { ResourcesService } from '../../../../../../../../../../../../services/shared/resources/resource.service';
import { CompletePaginationComponent } from '../../../../../../../../../../../landing/components/pagination/complete-pagination/complete-pagination.component';
import labels from './minute-approvers-list.lang';

@Component({
  standalone: true,
  selector: 'app-group-minute-approvers-list',
  templateUrl: './minute-approvers-list.component.html',
  imports: [CompletePaginationComponent],
})
export class GroupMinuteApproversListComponent implements OnInit {
  @Input() public minuteId!: string;
  public loadingApproves: boolean = true;
  public showApproversList: boolean = true;
  public approvals: MinuteApproval[] = [];

  public pagination: AppPagination = {
    totalElements: 0,
    pageSize: 5,
    currentPage: 1,
  };

  public constructor(
    private langService: LangService,
    private resourcesService: ResourcesService,
    private groupMinuteService: GroupMinutesService,
  ) {}

  public ngOnInit(): void {
    this.fetchApprovals();
  }

  public get lang() {
    return this.langService.language;
  }
  public get labels() {
    return labels;
  }

  public handleToggleShowApprovers() {
    this.showApproversList = !this.showApproversList;
    if (this.showApproversList) {
      this.fetchApprovals();
    }
  }

  private fetchApprovals() {
    return this.groupMinuteService
      .fetchApprovers(
        this.minuteId,
        this.pagination.currentPage - 1,
        this.pagination.pageSize,
      )
      .subscribe({
        next: (minuteConfirmation) => {
          this.approvals = minuteConfirmation.items;
          this.pagination.totalElements = minuteConfirmation.count;
          return this.fetchApproversInfo();
        },
      })
      .add(() => {
        this.loadingApproves = false;
      });
  }

  private fetchApproversInfo() {
    return Promise.all(
      this.approvals.map(({ approver }) =>
        lastValueFrom(
          this.resourcesService.getUserAvatarImageByUserId(approver.id),
        )
          .then((blob) => ({ userId: approver.id, content: blob }))
          .then(({ userId, content }) => {
            this.processAvatarResponse(content, userId);
          }),
      ),
    );
  }

  private processAvatarResponse(response: Blob, userId: string) {
    if (response.size === 0) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const browserUrl = reader.result as string;
      const approver = this.approvals.find(
        (item) => item.approver.id === userId,
      );
      if (approver) {
        approver.browserUrl = browserUrl;
      }
    };
    reader.readAsDataURL(response);
  }

  public handleGoToPage(page: number) {
    this.pagination.currentPage = page;
    this.fetchApprovals();
  }

  public formatDate(date: Date) {
    return formatDate(date);
  }
}
