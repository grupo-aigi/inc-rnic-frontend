import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { formatDate } from '../../../../../../../../../../helpers/date-formatters';
import { ConvocationBaseInfo } from '../../../../../../../../../../services/landing/convocation/convocation.interfaces';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../../../services/shared/resources/resource.service';
import labels from './preview-convocation-base-info.labels';

@Component({
  standalone: true,
  selector: 'app-preview-convocation-base-info',
  templateUrl: './preview-convocation-base-info.component.html',
  imports: [CommonModule],
})
export class PreviewConvocationBaseInfoComponent {
  @Input() public baseInfo!: ConvocationBaseInfo;

  public constructor(
    private langService: LangService,
    private resourcesService: ResourcesService,
  ) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public get imageUrl() {
    return this.resourcesService.getImageUrlByName(
      'convocations',
      this.baseInfo.imageName,
    );
  }

  public formatDate(date: Date): string {
    return formatDate(date);
  }
}
