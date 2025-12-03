
import { Component, Input, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../../../../../../../../services/auth/auth.service';
import { GroupMinutesService } from '../../../../../../../../../../services/intranet/minutes/group-minute.service';
import { GroupMinuteInfo } from '../../../../../../../../../../services/intranet/minutes/minutes.interfaces';
import { networkGroups } from '../../../../../../../../../../services/shared/groups/groups.data';
import { AppPagination } from '../../../../../../../../../../services/shared/misc/pagination.interfaces';
import { EditGroupMinuteComponent } from '../edit-minute/edit-minute.component';
import { GroupMinuteDetailComponent } from '../minute-detail/minute-detail.component';
import { NetworkGroups } from '../../../../../../../../../../services/shared/groups/groups.interfaces';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import labels from './minute-card.lang';

@Component({
  standalone: true,
  selector: 'app-group-minute-card',
  templateUrl: './minute-card.component.html',
  imports: [GroupMinuteDetailComponent, EditGroupMinuteComponent],
})
export class GroupMinuteCardComponent implements OnInit {
  @Input() public minute!: GroupMinuteInfo;

  public showDetail: boolean = true;
  public showEdit: boolean = false;

  public hasUserApproved: boolean = false;

  public loadingApproval: boolean = true;
  public loadingApprovalCount: boolean = true;
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
    private groupMinuteService: GroupMinutesService,
    private toastService: ToastrService,
    private authService: AuthService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.groupMinuteService
      .isMinuteApproved(this.minute.id!)
      .subscribe(({ approved }) => {
        this.hasUserApproved = approved;
        this.loadingApproval = false;
      });
    this.groupMinuteService
      .fetchApprovalCount(this.minute.id!)
      .subscribe(({ count }) => {
        this.minute.confirmation = {
          count,
          items: [],
        };
        this.loadingApprovalCount = false;
      });

    this.hasMinuteStarted = new Date(this.minute.start) < new Date();
    if (!this.hasMinuteStarted) return;

    this.fetchSelfAssistance();

    this.groupMinuteService
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

  public get groups() {
    return networkGroups;
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public get isMinuteOwner() {
    return this.minute.author?.id === this.authService.userInfo?.id;
  }

  public get group() {
    return networkGroups.find((group) => group.value === this.minute.group)!;
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
    this.groupMinuteService
      .hasUserAssisted(this.minute.id!)
      .subscribe(({ assisted }) => {
        this.hasUserAssisted = assisted;
        this.loadingAssistant = false;
      });
  }

  public handleMinuteEdited(minute: GroupMinuteInfo) {
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

  public handleApprove() {
    this.loadingOperation = true;
    this.showDetail = false;
    return this.groupMinuteService
      .approveMinute(this.minute.id!)
      .subscribe({
        next: () => {
          this.loadingOperation = false;
          this.minute.confirmation!.count++;
          this.hasUserApproved = true;
          this.toastService.success('Acta aprobada exitosamente');
        },
        error: (err) => {
          this.loadingOperation = false;
          this.toastService.error('Error al aprobar acta');
        },
      })
      .add(() => {
        this.showDetail = true;
      });
  }

  public get isOwnedByUser() {
    return this.minute.author?.id === this.authService.userInfo?.id;
  }

  public handleRemoveApproval() {
    this.loadingOperation = true;
    this.showDetail = false;
    return this.groupMinuteService
      .removeApproval(this.minute.id!)
      .subscribe({
        next: () => {
          this.loadingOperation = false;
          this.minute.confirmation!.count--;
          this.hasUserApproved = false;
          this.toastService.success('Aprobación removida exitosamente');
        },
        error: (err) => {
          this.loadingOperation = false;
          this.toastService.error('Error al remover aprobación');
        },
      })
      .add(() => {
        this.showDetail = true;
      });
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
