import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { RetirementSearchRecommendation } from '../../../../../../../../services/intranet/net-management/net-management.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './retirements-recommendations.lang';

@Component({
  standalone: true,
  selector: 'app-retirements-recommendations',
  templateUrl: './retirements-recommendations.component.html',
  imports: [CommonModule],
})
export class RetirementsRecommendationsComponent {
  @Input() public recommendedOptions: RetirementSearchRecommendation[] = [];

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
