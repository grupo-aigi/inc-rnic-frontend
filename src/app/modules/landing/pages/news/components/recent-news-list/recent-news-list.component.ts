
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { formatDate } from '../../../../../../helpers/date-formatters';
import { NewsPoster } from '../../../../../../services/landing/news/news.interfaces';
import { NewsService } from '../../../../../../services/landing/news/news.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';
import labels from './recent-news-list.lang';

@Component({
  standalone: true,
  selector: 'app-recent-news-list',
  templateUrl: './recent-news-list.component.html',
  imports: [RouterLink],
})
export class RecentNewsListComponent implements OnInit {
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  public loadingNews: boolean = false;
  public errorNews: boolean = false;
  public newsList: NewsPoster[] = [];
  public newsImages: string[] = [];

  public constructor(
    private newsService: NewsService,
    private langService: LangService,
    private toastService: ToastrService,
    private resourcesService: ResourcesService,
  ) {}

  public ngOnInit(): void {
    if (location.href.includes('/intranet')) {
      this.variant = 'INTRANET';
    }
    this.fetchNews();
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  private fetchNews() {
    this.loadingNews = true;
    this.newsService
      .fetchNewsPosters({ pagina: 0, cantidad: 5 })
      .then(({ records }) => {
        this.newsList = records;
        this.errorNews = false;
      })
      .catch((error) => {
        this.toastService.error(this.labels.errorNews[this.lang]);
        this.errorNews = true;
      })
      .finally(() => {
        this.loadingNews = false;
      });
  }

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('news', name);
  }

  public formatNewsDate(date: Date): string {
    return formatDate(date);
  }
}
