
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';

import { NewsPoster } from '../../../../../../services/landing/news/news.interfaces';
import { NewsService } from '../../../../../../services/landing/news/news.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';
import labels from './related-news-list.lang';
import { formatDate } from '../../../../../../helpers/date-formatters';

@Component({
  standalone: true,
  selector: 'app-related-news-list',
  templateUrl: './related-news-list.component.html',
  imports: [RouterLink],
})
export class RelatedNewsListComponent implements OnInit {
  @Input() public relatedNewsUrlNames!: string[];
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';
  public loadingNews = false;
  public newsPosters: NewsPoster[] = [];
  public newsImages: string[] = [];
  public errorFetchingNews = false;

  public constructor(
    private langService: LangService,
    private toastService: ToastrService,
    private resourcesService: ResourcesService,
    private newsService: NewsService,
  ) {}

  public ngOnInit() {
    if (location.href.includes('/intranet')) {
      this.variant = 'INTRANET';
    }
    this.fetchRelatedNews();
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public fetchRelatedNews() {
    this.loadingNews = true;
    this.errorFetchingNews = false;
    return Promise.all(
      this.relatedNewsUrlNames.map((urlName) =>
        lastValueFrom(this.newsService.fetchNewsDetail(urlName)),
      ),
    )
      .then((news) => this.processFetchedNews(news))
      .catch(() => {
        this.errorFetchingNews = true;
        this.toastService.error('Error fetching related news');
      })
      .finally(() => {
        this.loadingNews = false;
      });
  }

  public formatNewsDate(date: Date): string {
    return formatDate(date);
  }

  private processFetchedNews(newsPosters: NewsPoster[]) {
    this.loadingNews = false;
    this.newsPosters = newsPosters.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('news', name);
  }
}
