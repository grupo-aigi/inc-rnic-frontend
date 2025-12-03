
import { Component, Input, OnInit } from '@angular/core';

import { lastValueFrom } from 'rxjs';

import { CommissionMinutesService } from '../../../../../../../../../../../../services/intranet/minutes/commission-minute.service';
import { MinuteAssistant } from '../../../../../../../../../../../../services/intranet/minutes/minutes.interfaces';
import { AppPagination } from '../../../../../../../../../../../../services/shared/misc/pagination.interfaces';
import { ResourcesService } from '../../../../../../../../../../../../services/shared/resources/resource.service';
import { CompletePaginationComponent } from '../../../../../../../../../../../landing/components/pagination/complete-pagination/complete-pagination.component';
import labels from './minute-assistants-list.lang';
import { LangService } from '../../../../../../../../../../../../services/shared/lang/lang.service';

@Component({
  standalone: true,
  selector: 'app-commission-minute-assistants-list',
  templateUrl: './minute-assistants-list.component.html',
  imports: [CompletePaginationComponent],
})
export class CommissionMinuteAssistantsListComponent implements OnInit {
  @Input() public minuteId!: string;
  public loadingAssistants: boolean = true;

  public assistants: MinuteAssistant[] = [];

  public pagination: AppPagination = {
    totalElements: 0,
    pageSize: 5,
    currentPage: 1,
  };
  public showAssistantsList: boolean = true;

  public constructor(
    private resourcesService: ResourcesService,
    private langService: LangService,
    private commissionMinuteService: CommissionMinutesService,
  ) {}

  public ngOnInit(): void {
    this.fetchAssistants();
  }

  public handleToggleShowAssistants() {
    this.showAssistantsList = !this.showAssistantsList;
    if (this.showAssistantsList) {
      this.fetchAssistants();
    }
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  private fetchAssistants() {
    this.loadingAssistants = true;
    return this.commissionMinuteService
      .fetchAssistants(
        this.minuteId,
        this.pagination.currentPage - 1,
        this.pagination.pageSize,
      )
      .subscribe({
        next: (minuteAttendance) => {
          this.assistants = minuteAttendance.items;
          this.pagination.totalElements = minuteAttendance.count;
          return this.fetchAssistantsInfo();
        },
      })
      .add(() => {
        this.loadingAssistants = false;
      });
  }

  public handleGoToPage(page: number) {
    this.pagination.currentPage = page;
    this.fetchAssistants();
  }

  private fetchAssistantsInfo() {
    return Promise.all(
      this.assistants.map(({ assistant }) =>
        lastValueFrom(
          this.resourcesService.getUserAvatarImageByUserId(assistant.id),
        )
          .then((blob) => ({ userId: assistant.id, content: blob }))
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
      const approver = this.assistants.find(
        (item) => item.assistant.id === userId,
      );
      if (approver) {
        approver.browserUrl = browserUrl;
      }
    };
    reader.readAsDataURL(response);
  }
}
