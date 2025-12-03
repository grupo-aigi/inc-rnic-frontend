import { Component, Input } from '@angular/core';

import { NewsPoster } from '../../../../../../services/landing/news/news.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { NewsCategoryListComponent } from '../../../news/components/news-category-list/news-category-list.component';
import { NewsTagListComponent } from '../../../news/components/news-tag-list/news-tag-list.component';
import { RecentNewsListComponent } from '../../../news/components/recent-news-list/recent-news-list.component';
import { CurrentNewsSearchComponent } from '../current-news-search/current-news-search.component';
import { RelatedNewsListComponent } from '../related-news-list/related-news-list.component';
import labels from './current-news-sidebar.lang';

@Component({
  standalone: true,
  selector: 'app-current-news-sidebar',
  templateUrl: './current-news-sidebar.component.html',
  imports: [
    CurrentNewsSearchComponent,
    NewsCategoryListComponent,
    RelatedNewsListComponent,
    RelatedNewsListComponent,
    RecentNewsListComponent,
    NewsTagListComponent,
  ],
})
export class CurrentNewsSidebarComponent {
  @Input() public newsDetail!: NewsPoster;

  public constructor(public langService: LangService) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }
}
