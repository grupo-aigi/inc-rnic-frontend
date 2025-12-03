
import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from '../../../../../../../../../../services/auth/auth.service';
import commissions from '../../../../../../../../../../services/intranet/commissions/commissions.data';
import { CommissionMinutesService } from '../../../../../../../../../../services/intranet/minutes/commission-minute.service';
import { CommissionMinuteInfo } from '../../../../../../../../../../services/intranet/minutes/minutes.interfaces';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../../../services/shared/resources/resource.service';
import { CommissionMinuteAssistantsListComponent } from './components/minute-assistants-list/minute-assistants-list.component';
import labels from './minute-detail.lang';

@Component({
  standalone: true,
  selector: 'app-commission-minute-detail',
  templateUrl: './minute-detail.component.html',
  imports: [CommissionMinuteAssistantsListComponent],
})
export class CommissionMinuteDetailComponent implements OnInit {
  @Input() public minute!: CommissionMinuteInfo;

  public hasMinuteStarted: boolean = false;

  public constructor(
    private commissionMinuteService: CommissionMinutesService,
    private langService: LangService,
    private resourcesService: ResourcesService,
    private authService: AuthService,
  ) {}

  public ngOnInit(): void {
    this.hasMinuteStarted = new Date(this.minute.start) < new Date();
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public get meetingDate() {
    return new Date(this.minute.start).toISOString().split('T')[0];
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

  public get commissions() {
    return commissions;
  }

  public get commission() {
    return this.commissions.find(
      (c) => c.value === this.minute.commission.networkCommission,
    )?.label[this.lang];
  }
}
