import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from '../../../../../../../../../../services/auth/auth.service';
import commissions from '../../../../../../../../../../services/intranet/commissions/commissions.data';
import { CommissionMinutesService } from '../../../../../../../../../../services/intranet/minutes/commission-minute.service';
import { CommissionMinuteInfo } from '../../../../../../../../../../services/intranet/minutes/minutes.interfaces';
import { AppPagination } from '../../../../../../../../../../services/shared/misc/pagination.interfaces';
import { EditCommissionMinuteComponent } from '../edit-minute/edit-minute.component';
import { CommissionMinuteDetailComponent } from '../minute-detail/minute-detail.component';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import labels from './minute-card.lang';

@Component({
  standalone: true,
  selector: 'app-commission-minute-card',
  templateUrl: './minute-card.component.html',
  imports: [
    CommonModule,
    CommissionMinuteDetailComponent,
    EditCommissionMinuteComponent,
  ],
})
export class CommissionMinuteCardComponent implements OnInit {
  @Input() public minute!: CommissionMinuteInfo;

  public showDetail: boolean = true;
  public showEdit: boolean = false;
  public loadingOperation: boolean = false;
  public hasUserAssisted: boolean = false;
  public loadingAssistant: boolean = true;
  public loadingAssistantCount: boolean = true;
  public hasMinuteStarted: boolean = false;
  public createdByName: string = '';
  public pagination: AppPagination = {
    totalElements: 0,
    pageSize: 10,
    currentPage: 1,
  };

  public constructor(
    private commissionMinuteService: CommissionMinutesService,
    private authService: AuthService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.hasMinuteStarted = new Date(this.minute.start) < new Date();
    if (!this.hasMinuteStarted) return;

    this.fetchSelfAssistance();

    this.commissionMinuteService
      .fetchAssistantsCount(this.minute.id!)
      .subscribe(({ count }) => {
        this.minute.attendance = {
          count,
          items: [],
        };
        this.loadingAssistantCount = false;
      });
    this.authService
      .fetchBasicUserInfoById(this.minute.author?.id!)
      .subscribe(({ name }) => {
        this.createdByName = name;
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

  public get isMinuteOwner() {
    return this.minute.author?.id === this.authService.userInfo?.id;
  }

  public get commission() {
    return this.commissions.find(
      (commission) =>
        commission.value === this.minute.commission.networkCommission,
    )!;
  }

  public handleIncrementAssistants() {
    this.minute.attendance!.count++;
    this.fetchSelfAssistance();
  }

  public handleDecrementAssistants() {
    this.minute.attendance!.count--;
    this.fetchSelfAssistance();
  }

  private fetchSelfAssistance() {
    this.commissionMinuteService
      .hasUserAssisted(this.minute.id!)
      .subscribe(({ assisted }) => {
        this.hasUserAssisted = assisted;
        this.loadingAssistant = false;
      });
  }

  public handleMinuteEdited(minute: CommissionMinuteInfo) {
    this.minute = minute;
    this.toggleEdit();
  }

  public toggleDetail() {
    this.showDetail = !this.showDetail;
    this.showEdit = false;
  }

  public toggleEdit() {
    this.showEdit = !this.showEdit;
    this.showDetail = true;
  }

  public get meetingDate() {
    return new Date(this.minute.start).toISOString().split('T')[0];
  }

  public get isOwnedByUser() {
    return this.minute.author?.id === this.authService.userInfo?.id;
  }

  public getTime(date: Date) {
    const timeOffset = new Date().getTimezoneOffset() * 60000;
    return new Date(new Date(date).getTime() - timeOffset).toLocaleTimeString(
      this.langService.language,
      {
        hour: '2-digit',
        minute: '2-digit',
      },
    );
  }
}
