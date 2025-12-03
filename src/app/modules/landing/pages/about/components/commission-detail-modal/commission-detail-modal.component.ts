
import { Component, Input, OnInit } from '@angular/core';

import {
  CommissionInformation,
  Commissions,
} from '../../../../../../services/intranet/commissions/commissions.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './commissions-detail-modal.lang';

@Component({
  standalone: true,
  selector: 'app-commission-detail-modal',
  templateUrl: './commission-detail-modal.component.html',
  imports: [],
})
export class CommissionDetailModalComponent implements OnInit {
  @Input('commission') public commission!: Commissions;
  public commissionLabels: CommissionInformation | null = null;

  public constructor(private langService: LangService) {}

  public ngOnInit(): void {
    this.commissionLabels = this.labels.find(({ name }) => {
      return name === this.commission;
    })!;
  }

  public getCommissionInformation(commission: Commissions) {
    return this.labels.find(({ name }) => name === commission)!;
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public getFormattedDate(dateString: string): string {
    const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
    const parsedDate = new Date(
      new Date(dateString).getTime() + timezoneOffsetInMinutes * 60 * 1000,
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
