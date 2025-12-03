import { Component } from '@angular/core';

import { NewsService } from '../../../../../../services/landing/news/news.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { NewsCategoryListComponent } from '../news-category-list/news-category-list.component';
import { NewsMonthlySummaryComponent } from '../news-monthly-summary/news-monthly-summary.component';
import { NewsTagListComponent } from '../news-tag-list/news-tag-list.component';
import { NewsletterListComponent } from '../newsletter-list/newsletter-list.component';
import { RecentNewsListComponent } from '../recent-news-list/recent-news-list.component';
import labels from './news-right-sidebar.lang';

@Component({
  standalone: true,
  selector: 'app-news-right-sidebar',
  templateUrl: './news-right-sidebar.component.html',
  imports: [
    NewsletterListComponent,
    NewsCategoryListComponent,
    RecentNewsListComponent,
    NewsMonthlySummaryComponent,
    NewsTagListComponent,
  ],
})
export class NewsRightSidebarComponent {
  public constructor(
    private langService: LangService,
    private newsService: NewsService,
  ) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }
}
