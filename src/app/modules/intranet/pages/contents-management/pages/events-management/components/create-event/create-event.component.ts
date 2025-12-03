
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import {
  EventBaseInfo,
  EventBaseInfoBody,
  EventCreateInfo,
} from '../../../../../../../../services/landing/event/event.interfaces';
import { ResourceContent } from '../../../../../../../../services/shared/contents/contents.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { EventService } from '../../../../../../../landing/../../services/landing/event/event.service';
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
import { CreateEventBaseInfoComponent } from './components/create-event-base-info/create-event-base-info.component';
import { CreateEventCurrentResourcesComponent } from './components/create-event-current-resources/create-event-current-resources.component';
import labels from './create-event.lang';

@Component({
  standalone: true,
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  imports: [
    CreateEventBaseInfoComponent,
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
    CreateEventCurrentResourcesComponent
],
})
export class CreateEventComponent implements OnInit {
  @Input() public eventUrlNameToEdit: string | undefined;
  @Output() private onSubmit: EventEmitter<EventCreateInfo> =
    new EventEmitter();
  @Output() private onCancelUpdate: EventEmitter<void> = new EventEmitter();
  public resources: ResourceContent[] = [];
  public baseInfo: EventBaseInfo | undefined;
  public activeTabIndex: number = 0;

  public constructor(
    private router: Router,
    private eventService: EventService,
    private toastService: ToastrService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    if (!this.eventUrlNameToEdit) return;
    this.eventService
      .fetchEventPosterDetail(this.eventUrlNameToEdit)
      .subscribe((response) => {
        this.baseInfo = {
          id: response.id,
          title: response.title,
          description: response.description,
          author: response.author,
          startDate: response.startDate,
          tags: response.tags,
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
    this.router.navigate([], { fragment: 'event-summary__location' });
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

  public handleSetBaseInfo(baseInfo: EventBaseInfo) {
    this.router.navigate([], { fragment: 'event-summary__location' });
    this.baseInfo = baseInfo;
  }

  public changeActiveTab(index: number) {
    this.activeTabIndex = index;
  }

  public handlePublishEvent() {
    if (!this.baseInfo) return;

    const eventBaseInfo: EventBaseInfoBody = {
      ...this.baseInfo,
      categoryId: this.baseInfo.category.id,
      tagIdList: this.baseInfo.tags.map((tag) => tag.id),
    };
    this.onSubmit.emit({
      baseInfo: eventBaseInfo,
      resources: this.resources,
    });
  }
}
