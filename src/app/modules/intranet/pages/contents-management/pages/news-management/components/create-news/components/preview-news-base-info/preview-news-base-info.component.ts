import { Component, Input } from '@angular/core';

import { formatDate } from '../../../../../../../../../../helpers/date-formatters';
import { NewsBaseInfo } from '../../../../../../../../../../services/landing/news/news.interfaces';
import { ResourcesService } from '../../../../../../../../../../services/shared/resources/resource.service';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import labels from './preview-news-base-info.lang';

@Component({
  standalone: true,
  selector: 'app-preview-news-base-info',
  templateUrl: './preview-news-base-info.component.html',
  imports: [],
})
export class PreviewNewsBaseInfoComponent {
  @Input() public baseInfo!: NewsBaseInfo;

  public constructor(
    private langService: LangService,
    private resourcesService: ResourcesService,
  ) {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public formatDate(date: Date): string {
    return formatDate(date);
  }

  public get imageUrl() {
    return this.resourcesService.getImageUrlByName(
      'news',
      this.baseInfo.imageName,
    );
  }
}
