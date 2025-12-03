
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { LangService } from '../../../../../../../../services/shared/lang/lang.service';

import {
  NewsBaseInfo,
  NewsBaseInfoBody,
  NewsCreateInfo,
} from '../../../../../../../../services/landing/news/news.interfaces';
import { NewsService } from '../../../../../../../../services/landing/news/news.service';
import { ResourceContent } from '../../../../../../../../services/shared/contents/contents.interfaces';
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
import { CreateNewsBaseInfoComponent } from './components/create-news-base-info/create-news-base-info.component';
import { CreateNewsCurrentResourcesComponent } from './components/create-news-current-resources/create-news-current-resources.component';
import labels from './create-news.lang';

@Component({
  standalone: true,
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  imports: [
    CreateNewsBaseInfoComponent,
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
    CreateNewsCurrentResourcesComponent
],
})
export class CreateNewsComponent implements OnInit {
  @Input() public newsUrlNameToEdit: string | undefined;
  @Output() private onSubmit: EventEmitter<NewsCreateInfo> = new EventEmitter();
  @Output() private onCancelUpdate: EventEmitter<void> = new EventEmitter();
  public resources: ResourceContent[] = [];
  public baseInfo: NewsBaseInfo | null = null;
  public loading: boolean = false;
  public activeTabIndex: number = 0;

  public constructor(
    private router: Router,
    private newsService: NewsService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    if (!this.newsUrlNameToEdit) return;
    this.newsService
      .fetchNewsDetail(this.newsUrlNameToEdit)
      .subscribe((response) => {
        this.baseInfo = {
          id: response.id,
          title: response.title,
          description: response.description,
          category: response.category,
          imageName: response.imageName,
          date: response.date,
          author: response.author,
          tags: response.tags,
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

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleMoveDown(index: number) {
    const aux = this.resources[index];
    this.resources[index] = this.resources[index + 1];
    this.resources[index + 1] = aux;
  }

  public handleAddResource(resource: ResourceContent) {
    this.router.navigate([], { fragment: 'news-summary__location' });
    this.resources.push(resource);
  }

  public handleRemoveResource(index: number) {
    this.resources.splice(index, 1);
    this.router.navigate([], { fragment: 'news-summary__location' });
  }

  public handleSelectTab(event: MouseEvent, tabNumber: number) {
    if (tabNumber > 0 && !this.baseInfo) {
      event.preventDefault();
    }
  }

  public handleClickOnTab() {
    // Navigate to the same view and Remove the fragment
    this.router.navigate([]);
  }

  public changeActiveTab(index: number) {
    this.activeTabIndex = index;
  }

  public handleSetBaseInfo(baseInfo: NewsBaseInfo) {
    this.router.navigate([], { fragment: 'news-summary__location' });
    this.baseInfo = baseInfo;
  }

  public handlePublishNews() {
    if (!this.baseInfo) return;

    const newsBaseInfo: NewsBaseInfoBody = {
      ...this.baseInfo,
      categoryId: this.baseInfo.category.id,
      tagIdList: this.baseInfo.tags.map(({ id }) => id),
    };
    this.onSubmit.emit({
      baseInfo: newsBaseInfo,
      resources: this.resources,
    });
  }
}
