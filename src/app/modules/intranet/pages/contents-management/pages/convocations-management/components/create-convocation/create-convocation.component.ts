
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import {
  ConvocationBaseInfo,
  ConvocationBaseInfoBody,
  ConvocationCreateInfo,
} from '../../../../../../../../services/landing/convocation/convocation.interfaces';
import { ConvocationService } from '../../../../../../../../services/landing/convocation/convocation.service';
import { ResourceContent } from '../../../../../../../../services/shared/contents/contents.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { CreateResourceContentType1Component } from '../../../shared/create-resource-content-type1/create-resource-content-type1.component';
import { CreateResourceContentType10Component } from '../../../shared/create-resource-content-type10/create-resource-content-type10.component';
import { CreateResourceContentType11Component } from '../../../shared/create-resource-content-type11/create-resource-content-type11.component';
import { CreateResourceContentType12Component } from '../../../shared/create-resource-content-type12/create-resource-content-type12.component';
import { CreateResourceContentType13Component } from '../../../shared/create-resource-content-type13/create-resource-content-type13.component';
import { CreateResourceContentType14Component } from '../../../shared/create-resource-content-type14/create-resource-content-type14.component';
import { CreateResourceContentType2Component } from '../../../shared/create-resource-content-type2/create-resource-content-type2.component';
import { CreateResourceContentType3Component } from '../../../shared/create-resource-content-type3/create-resource-content-type3.component';
import { CreateResourceContentType4Component } from '../../../shared/create-resource-content-type4/create-resource-content-type4.component';
import { CreateResourceContentType5Component } from '../../../shared/create-resource-content-type5/create-resource-content-type5.component';
import { CreateResourceContentType6Component } from '../../../shared/create-resource-content-type6/create-resource-content-type6.component';
import { CreateResourceContentType7Component } from '../../../shared/create-resource-content-type7/create-resource-content-type7.component';
import { CreateResourceContentType8Component } from '../../../shared/create-resource-content-type8/create-resource-content-type8.component';
import { CreateResourceContentType9Component } from '../../../shared/create-resource-content-type9/create-resource-content-type9.component';
import { CreateConvocationBaseInfoComponent } from './components/create-convocation-base-info/create-convocation-base-info.component';
import { CreateConvocationCurrentResourcesComponent } from './components/create-convocation-current-resources/create-convocation-current-resources.component';
import labels from './create-convocation.lang';

@Component({
  standalone: true,
  selector: 'app-create-convocation',
  templateUrl: './create-convocation.component.html',
  imports: [
    CreateConvocationBaseInfoComponent,
    CreateResourceContentType1Component,
    CreateResourceContentType2Component,
    CreateResourceContentType3Component,
    CreateResourceContentType4Component,
    CreateResourceContentType5Component,
    CreateResourceContentType6Component,
    CreateResourceContentType7Component,
    CreateResourceContentType8Component,
    CreateResourceContentType9Component,
    CreateResourceContentType10Component,
    CreateResourceContentType11Component,
    CreateResourceContentType12Component,
    CreateResourceContentType13Component,
    CreateResourceContentType14Component,
    CreateConvocationCurrentResourcesComponent
],
})
export class CreateConvocationComponent implements OnInit {
  @Input() public convocationUrlNameToEdit: string | undefined;

  @Output() private onSubmit: EventEmitter<ConvocationCreateInfo> =
    new EventEmitter();
  @Output() private onCancelUpdate: EventEmitter<void> = new EventEmitter();
  public resources: ResourceContent[] = [];
  public baseInfo: ConvocationBaseInfo | undefined;
  public activeTabIndex: number = 0;

  public constructor(
    private router: Router,
    private langService: LangService,
    private convocationService: ConvocationService,
  ) {}

  public ngOnInit(): void {
    if (!this.convocationUrlNameToEdit) return;
    this.convocationService
      .fetchConvocationDetail(this.convocationUrlNameToEdit)
      .subscribe((response) => {
        this.baseInfo = {
          id: response.id,
          title: response.title,
          description: response.description,
          budget: response.budget,
          files: response.files,
          startDate: response.startDate,
          endDate: response.endDate,
          category: response.category,
          scope: response.scope,
          imageName: response.imageName,
        };
        this.resources = response.resources.map(
          ({ content, resourceType }) => ({
            TYPE: resourceType,
            ...JSON.parse(content),
          }),
        );
      });
  }

  public handleCancelUpdate() {
    this.onCancelUpdate.emit();
  }

  public handleMoveUp(index: number) {
    const aux = this.resources[index];
    this.resources[index] = this.resources[index - 1];
    this.resources[index - 1] = aux;
  }

  public handleMoveDown(index: number) {
    const aux = this.resources[index];
    this.resources[index] = this.resources[index + 1];
    this.resources[index + 1] = aux;
  }

  public handleAddResource(resource: ResourceContent) {
    this.router.navigate([], { fragment: 'convocation-summary__location' });
    this.resources.push(resource);
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleClickOnTab() {
    // Navigate to the same view and Remove the fragment
    this.router.navigate([]);
  }

  public handleSetBaseInfo(baseInfo: ConvocationBaseInfo) {
    this.router.navigate([], { fragment: 'convocation-summary__location' });
    this.baseInfo = baseInfo;
  }

  public changeActiveTab(index: number) {
    this.activeTabIndex = index;
  }

  public handlePublishConvocation() {
    if (!this.baseInfo) return;

    const convocationBaseInfo: ConvocationBaseInfoBody = {
      ...this.baseInfo,
      categoryId: this.baseInfo.category.id,
      filesIds: this.baseInfo.files.map(({ id }) => id!),
    };
    this.onSubmit.emit({
      baseInfo: convocationBaseInfo,
      resources: this.resources,
    });
  }
}
