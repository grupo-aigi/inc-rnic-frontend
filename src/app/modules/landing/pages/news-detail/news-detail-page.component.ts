
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NewsPoster } from '../../../../services/landing/news/news.interfaces';
import { NewsService } from '../../../../services/landing/news/news.service';
import { LangService } from '../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../services/shared/resources/resource.service';
import { ResourceContentType1Component } from '../shared/components/resource-content-type1/resource-content-type1.component';
import { ResourceContentType10Component } from '../shared/components/resource-content-type10/resource-content-type10.component';
import { ResourceContentType11Component } from '../shared/components/resource-content-type11/resource-content-type11.component';
import { ResourceContentType12Component } from '../shared/components/resource-content-type12/resource-content-type12.component';
import { ResourceContentType13Component } from '../shared/components/resource-content-type13/resource-content-type13.component';
import { ResourceContentType14Component } from '../shared/components/resource-content-type14/resource-content-type14.component';
import { ResourceContentType2Component } from '../shared/components/resource-content-type2/resource-content-type2.component';
import { ResourceContentType3Component } from '../shared/components/resource-content-type3/resource-content-type3.component';
import { ResourceContentType4Component } from '../shared/components/resource-content-type4/resource-content-type4.component';
import { ResourceContentType5Component } from '../shared/components/resource-content-type5/resource-content-type5.component';
import { ResourceContentType6Component } from '../shared/components/resource-content-type6/resource-content-type6.component';
import { ResourceContentType7Component } from '../shared/components/resource-content-type7/resource-content-type7.component';
import { ResourceContentType8Component } from '../shared/components/resource-content-type8/resource-content-type8.component';
import { ResourceContentType9Component } from '../shared/components/resource-content-type9/resource-content-type9.component';
import { CurrentNewsSidebarComponent } from './components/current-news-sidebar/current-news-sidebar.component';
import { CurrentNewsSummaryComponent } from './components/current-news-summary/current-news-summary.component';
import { CurrentNewsTagsComponent } from './components/current-news-tags/current-news-tags.component';
import labels from './news-detail-page.lang';

@Component({
  standalone: true,
  selector: 'app-news-detail-page',
  templateUrl: './news-detail-page.component.html',
  imports: [
    RouterLink,
    CurrentNewsTagsComponent,
    CurrentNewsSummaryComponent,
    CurrentNewsSidebarComponent,
    ResourceContentType1Component,
    ResourceContentType2Component,
    ResourceContentType3Component,
    ResourceContentType4Component,
    ResourceContentType5Component,
    ResourceContentType6Component,
    ResourceContentType7Component,
    ResourceContentType8Component,
    ResourceContentType9Component,
    ResourceContentType10Component,
    ResourceContentType11Component,
    ResourceContentType12Component,
    ResourceContentType13Component,
    ResourceContentType14Component
],
})
export class NewsDetailPage implements OnInit {
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  public urlName: string = '';
  public newsDetail: NewsPoster | null = null;
  public showMobileSidebar: boolean = false;
  public loadingNews: boolean = false;

  public constructor(
    private title: Title,
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService,
    private langService: LangService,
    private resourcesService: ResourcesService,
  ) {}

  public ngOnInit(): void {
    if (location.href.includes('/intranet')) {
      this.variant = 'INTRANET';
    }
    this.route.paramMap.subscribe((params) => {
      this.urlName = params.get('urlName') ?? '';
      if (!this.urlName) {
        return this.router.navigate(['/not-found']);
      }
      this.loadingNews = true;
      return this.newsService
        .fetchNewsDetail(this.urlName)
        .subscribe((newsDetail) => {
          if (!newsDetail) {
            this.router.navigate(['/not-found']);
            return;
          }
          this.newsDetail = newsDetail;
          this.setTitle();
        })
        .add(() => {
          this.loadingNews = false;
        });
    });
  }

  public handleToggleMobileSidebar() {
    this.showMobileSidebar = !this.showMobileSidebar;
  }

  private setTitle() {
    this.title.setTitle(
      `${this.newsDetail!.title} | ${this.labels.pageTitleSuffix[this.lang]}`,
    );
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(
        `${this.newsDetail!.title} | ${this.labels.pageTitleSuffix[lang]}`,
      );
    });
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }
}
