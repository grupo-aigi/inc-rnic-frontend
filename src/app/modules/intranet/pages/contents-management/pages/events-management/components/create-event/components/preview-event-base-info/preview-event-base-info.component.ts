import { Component, EventEmitter, Input, Output } from '@angular/core';

import { formatDate } from '../../../../../../../../../../helpers/date-formatters';
import { EventBaseInfo } from '../../../../../../../../../../services/landing/event/event.interfaces';
import { ResourcesService } from '../../../../../../../../../../services/shared/resources/resource.service';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import labels from './preview-event-base-info.lang';

@Component({
  standalone: true,
  selector: 'app-preview-event-base-info',
  templateUrl: './preview-event-base-info.component.html',
  imports: [],
})
export class PreviewEventBaseInfoComponent {
  @Input() public baseInfo!: EventBaseInfo;

  public constructor(
    public langService: LangService,
    private resourcesService: ResourcesService,
  ) {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public formatDate(date: Date): string {
    return formatDate(date, true);
  }

  public get imageUrl() {
    return this.resourcesService.getImageUrlByName(
      'events',
      this.baseInfo.imageName,
    );
  }
}
