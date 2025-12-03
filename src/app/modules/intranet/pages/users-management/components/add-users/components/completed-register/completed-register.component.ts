
import { Component, Input } from '@angular/core';

import { UserRegister } from '../../../../../../../../services/auth/auth.interfaces';
import {
  CommissionDetail,
  Commissions,
} from '../../../../../../../../services/intranet/commissions/commissions.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import commissions from '../../../../../../../../services/intranet/commissions/commissions.data';

@Component({
  standalone: true,
  selector: 'app-completed-register',
  templateUrl: './completed-register.component.html',
  imports: [],
})
export class CompletedRegisterComponent {
  @Input() public registerInfo!: UserRegister;

  public constructor(private langService: LangService) {}

  public get lang() {
    return this.langService.language;
  }

  public get commissions() {
    return commissions;
  }

  public getCommissionLabel(commission: string) {
    return this.commissions.find(({ value }) => value === commission)?.label[
      this.lang
    ];
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
