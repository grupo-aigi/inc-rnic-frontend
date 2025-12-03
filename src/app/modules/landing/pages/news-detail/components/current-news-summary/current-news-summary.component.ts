import { Component, Input } from '@angular/core';

import { NewsPoster } from '../../../../../../services/landing/news/news.interfaces';
import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';
import { formatDateByLang } from '../../../../../../helpers/date-formatters';
import { LangService } from '../../../../../../services/shared/lang/lang.service';

@Component({
  standalone: true,
  selector: 'app-current-news-summary',
  templateUrl: './current-news-summary.component.html',
  inputs: ['news'],
})
export class CurrentNewsSummaryComponent {
  @Input() newsDetail!: NewsPoster;

  public constructor(
    private resourcesService: ResourcesService,

    private langService: LangService,
  ) {}

  public getImageUrlByName(imageName: string) {
    return this.resourcesService.getImageUrlByName(
      'news',
      this.newsDetail!.imageName,
    );
  }

  public formatDate(date: Date) {
    const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
    const parsedDate = new Date(
      new Date(date).getTime() + timezoneOffsetInMinutes * 60 * 1000,
    );

    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    return parsedDate.toLocaleDateString('es-CO', options);
  }
}
