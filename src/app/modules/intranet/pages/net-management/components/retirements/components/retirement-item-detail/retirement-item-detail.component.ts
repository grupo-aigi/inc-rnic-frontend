import { Component, Input, OnInit } from '@angular/core';

import commissions from '../../../../../../../../services/intranet/commissions/commissions.data';
import { Commissions } from '../../../../../../../../services/intranet/commissions/commissions.interfaces';
import { NetworkRetirement } from '../../../../../../../../services/intranet/net-management/net-management.interfaces';
import { AppLanguage } from '../../../../../../../../services/shared/lang/lang.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './retirement-item-detail.lang';

@Component({
  standalone: true,
  selector: 'app-retirement-item-detail',
  templateUrl: './retirement-item-detail.component.html',
})
export class RetirementItemDetailComponent implements OnInit {
  @Input() public retirement!: NetworkRetirement;

  public constructor(private langService: LangService) {}

  public ngOnInit(): void {}

  public getCommissionName(
    commissionValue: Commissions,
    lang: AppLanguage,
  ): string {
    const commissionDetail = this.commissions.find(
      (commission) => commission.value === commissionValue,
    );
    return commissionDetail ? commissionDetail.label[lang] : '';
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public get commissions() {
    return commissions;
  }

  public formatDate(dateString: string): string {
    const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
    const parsedDate = new Date(
      new Date(dateString).getTime() + timezoneOffsetInMinutes * 60 * 1000,
    );

    const navigatorLanguage =
      this.langService.language === 'es' ? 'es-ES' : 'en-US';

    const options: Intl.DateTimeFormatOptions = {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    };
    return parsedDate.toLocaleDateString(navigatorLanguage, options);
  }
}
