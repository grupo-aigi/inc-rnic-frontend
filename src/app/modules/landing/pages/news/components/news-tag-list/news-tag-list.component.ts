
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { NewsService } from '../../../../../../services/landing/news/news.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { NewsTagsModalComponent } from '../news-tags-modal/news-tags-modal.component';
import labels from './news-tag-list.lang';

@Component({
  standalone: true,
  selector: 'app-news-tag-list',
  templateUrl: './news-tag-list.component.html',
  imports: [NewsTagsModalComponent, RouterLink],
})
export class NewsTagListComponent implements OnInit {
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  public loadingSummaries = false;
  public errorSummaries = false;
  public newsTagsSummaries: { id: number; name: string; count: number }[] = [];

  public constructor(
    private newsService: NewsService,
    private langService: LangService,
    private toastService: ToastrService,
  ) {}

  public ngOnInit() {
    if (location.href.includes('/intranet')) {
      this.variant = 'INTRANET';
    }
    this.fetchNewsTagsSummaries();
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  private fetchNewsTagsSummaries() {
    this.loadingSummaries = true;
    this.newsService
      .getNewsTagsSummaries({ pagina: 0, cantidad: 10 })
      .then((response) => {
        this.newsTagsSummaries = response;
        this.errorSummaries = false;
      })
      .catch((error) => {
        this.toastService.error(this.labels.errorsTags[this.lang]);
        this.errorSummaries = true;
      })
      .finally(() => {
        this.loadingSummaries = false;
      });
  }

  public handleRetryFetch() {
    this.fetchNewsTagsSummaries();
  }
}
