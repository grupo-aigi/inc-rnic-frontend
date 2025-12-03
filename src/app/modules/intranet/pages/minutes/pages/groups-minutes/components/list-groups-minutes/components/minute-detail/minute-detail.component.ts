
import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from '../../../../../../../../../../services/auth/auth.service';
import { GroupMinutesService } from '../../../../../../../../../../services/intranet/minutes/group-minute.service';
import { GroupMinuteInfo } from '../../../../../../../../../../services/intranet/minutes/minutes.interfaces';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../../../services/shared/resources/resource.service';
import { GroupMinuteApproversListComponent } from './components/minute-approvers-list/minute-approvers-list.component';
import { GroupMinuteAssistantsListComponent } from './components/minute-assistants-list/minute-assistants-list.component';
import { networkGroups } from '../../../../../../../../../../services/shared/groups/groups.data';
import labels from './minute-detail.lang';

@Component({
  standalone: true,
  selector: 'app-group-minute-detail',
  templateUrl: './minute-detail.component.html',
  imports: [
    GroupMinuteApproversListComponent,
    GroupMinuteAssistantsListComponent
],
})
export class GroupMinuteDetailComponent implements OnInit {
  @Input() minute!: GroupMinuteInfo;

  public loadingAssistants: boolean = true;
  public approversInfo: {
    id: string;
    browserUrl: string;
    name?: string;
    confirmedAt?: Date;
  }[] = [];

  public assistants: any;
  public hasMinuteStarted: boolean = false;

  public constructor(
    private groupMinuteService: GroupMinutesService,
    private langService: LangService,
    private resourcesService: ResourcesService,
    private authService: AuthService,
  ) {}

  public ngOnInit(): void {
    this.hasMinuteStarted = new Date(this.minute.start) < new Date();
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public get meetingDate() {
    return new Date(this.minute.start).toISOString().split('T')[0];
  }

  public get startTime() {
    return new Date(this.minute.start).toLocaleTimeString();
  }

  public get endTime() {
    return new Date(this.minute.end).toLocaleTimeString();
  }

  public get groups() {
    return networkGroups;
  }

  public get group() {
    return networkGroups.find((g) => g.value === this.minute.group)?.label[
      this.lang
    ];
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
