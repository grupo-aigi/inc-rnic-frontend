import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NewsBaseInfo } from '../../../../../../../../../../services/landing/news/news.interfaces';
import { ResourceContent } from '../../../../../../../../../../services/shared/contents/contents.interfaces';
import { PreviewResourceContentType1Component } from '../../../../../shared/preview-resource-content-type1/preview-resource-content-type1.component';
import { PreviewResourceContentType10Component } from '../../../../../shared/preview-resource-content-type10/preview-resource-content-type10.component';
import { PreviewResourceContentType11Component } from '../../../../../shared/preview-resource-content-type11/preview-resource-content-type11.component';
import { PreviewResourceContentType12Component } from '../../../../../shared/preview-resource-content-type12/preview-resource-content-type12.component';
import { PreviewResourceContentType13Component } from '../../../../../shared/preview-resource-content-type13/preview-resource-content-type13.component';
import { PreviewResourceContentType14Component } from '../../../../../shared/preview-resource-content-type14/preview-resource-content-type14.component';
import { PreviewResourceContentType2Component } from '../../../../../shared/preview-resource-content-type2/preview-resource-content-type2.component';
import { PreviewResourceContentType3Component } from '../../../../../shared/preview-resource-content-type3/preview-resource-content-type3.component';
import { PreviewResourceContentType4Component } from '../../../../../shared/preview-resource-content-type4/preview-resource-content-type4.component';
import { PreviewResourceContentType5Component } from '../../../../../shared/preview-resource-content-type5/preview-resource-content-type5.component';
import { PreviewResourceContentType6Component } from '../../../../../shared/preview-resource-content-type6/preview-resource-content-type6.component';
import { PreviewResourceContentType7Component } from '../../../../../shared/preview-resource-content-type7/preview-resource-content-type7.component';
import { PreviewResourceContentType8Component } from '../../../../../shared/preview-resource-content-type8/preview-resource-content-type8.component';
import { PreviewResourceContentType9Component } from '../../../../../shared/preview-resource-content-type9/preview-resource-content-type9.component';
import { PreviewNewsBaseInfoComponent } from '../preview-news-base-info/preview-news-base-info.component';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import labels from './create-news-current-resources.lang';

@Component({
  standalone: true,
  selector: 'app-create-news-current-resources',
  templateUrl: './create-news-current-resources.component.html',
  imports: [
    ReactiveFormsModule,
    PreviewNewsBaseInfoComponent,
    PreviewResourceContentType1Component,
    PreviewResourceContentType2Component,
    PreviewResourceContentType3Component,
    PreviewResourceContentType4Component,
    PreviewResourceContentType5Component,
    PreviewResourceContentType6Component,
    PreviewResourceContentType7Component,
    PreviewResourceContentType8Component,
    PreviewResourceContentType9Component,
    PreviewResourceContentType10Component,
    PreviewResourceContentType11Component,
    PreviewResourceContentType12Component,
    PreviewResourceContentType13Component,
    PreviewResourceContentType14Component,
  ],
})
export class CreateNewsCurrentResourcesComponent {
  @Input() public currentResources: ResourceContent[] = [];
  @Input() public baseInfo!: NewsBaseInfo;
  @Output() onMoveUp: EventEmitter<number> = new EventEmitter();
  @Output() onMoveDown: EventEmitter<number> = new EventEmitter();

  public constructor(private langService: LangService) {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public moveUp(index: number) {
    this.onMoveUp.emit(index);
  }

  public moveDown(index: number) {
    this.onMoveDown.emit(index);
  }

  public handleDeleteResource(index: number) {
    this.currentResources = this.currentResources.filter((_, i) => i !== index);
  }
}
