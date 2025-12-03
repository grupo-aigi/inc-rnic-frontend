
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { NewsService } from '../../../../../../services/landing/news/news.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { NewsCategoriesModalComponent } from '../news-categories-modal/news-categories-modal.component';
import labels from './news-category-list.lang';

@Component({
  standalone: true,
  selector: 'app-news-category-list',
  templateUrl: './news-category-list.component.html',
  imports: [RouterLink, NewsCategoriesModalComponent],
})
export class NewsCategoryListComponent implements OnInit {
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  public loadingSummaries = false;
  public errorSummaries = false;
  public newsCategorySummaries: { id: number; name: string; count: number }[] =
    [];

  public constructor(
    private newsService: NewsService,
    private langService: LangService,
    private toastService: ToastrService,
  ) {}

  public ngOnInit() {
    if (location.href.includes('/intranet')) {
      this.variant = 'INTRANET';
    }
    this.fetchNewsCategoriesSummaries();
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  private fetchNewsCategoriesSummaries() {
    this.loadingSummaries = true;
    this.newsService
      .getNewsCategorySummaries({ pagina: 0, cantidad: 10 })
      .then((response) => {
        this.newsCategorySummaries = response;
        this.errorSummaries = false;
      })
      .catch((error) => {
        this.toastService.error(this.labels.errorsCategories[this.lang]);
        this.errorSummaries = true;
      })
      .finally(() => {
        this.loadingSummaries = false;
      });
  }

  public handleRetryFetch() {
    this.fetchNewsCategoriesSummaries();
  }
}
