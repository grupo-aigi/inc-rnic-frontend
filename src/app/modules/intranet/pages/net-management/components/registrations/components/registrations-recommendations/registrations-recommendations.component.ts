import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { RegistrationSearchRecommendation } from '../../../../../../../../services/intranet/net-management/net-management.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './registrations-recommendations.lang';

@Component({
  standalone: true,
  selector: 'app-registrations-recommendations',
  templateUrl: './registrations-recommendations.component.html',
  imports: [CommonModule],
})
export class RegistrationsRecommendationsComponent {
  @Input() public recommendedOptions: RegistrationSearchRecommendation[] = [];

  public constructor(private langService: LangService) {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public formatDate(dateString: string): string {
    const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
    const parsedDate = new Date(
      new Date(dateString).getTime() + timezoneOffsetInMinutes * 60 * 1000,
    );

    const navigatorLanguage =
      this.langService.language === 'en' ? 'en-US' : 'es-ES';

    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    return parsedDate.toLocaleDateString(navigatorLanguage, options);
  }
}
