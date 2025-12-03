
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';

import { NewsService } from '../../../../../../services/landing/news/news.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './news-tags-modal.lang';

@Component({
  standalone: true,
  selector: 'app-news-tags-modal',
  templateUrl: './news-tags-modal.component.html',
  imports: [RouterLink, FormsModule],
})
export class NewsTagsModalComponent implements OnInit {
  public loadingSummaries = false;
  public errorSummaries = false;
  public showError = false;
  public searchDebounce: Subject<string> = new Subject();
  public search = '';
  public page = 0;
  public newsTagsSummaries: { id: number; name: string; count: number }[] = [];
  @ViewChild('closeModalBtn')
  public closeModalBtn!: ElementRef<HTMLButtonElement>;
  public loadingRecommendations = false;
  public endOfList: boolean = true;
  public constructor(
    private newsService: NewsService,
    private langService: LangService,
    private toastService: ToastrService,
  ) {}

  public ngOnInit() {
    this.searchDebounce.pipe(debounceTime(750)).subscribe((searchTerm) => {
      if (!searchTerm) {
        this.newsTagsSummaries = [];
        return;
      }
      this.loadingRecommendations = true;
      this.page = 0;
      this.fetchNewsTagsSummaries();
    });
  }

  public async handleSearchByTerm($event: KeyboardEvent) {
    if ($event.key === 'Escape') {
      return;
    }
    const searchTerm = ($event.target as HTMLInputElement).value as string;
    this.searchDebounce.next(searchTerm);
  }

  public get labels() {
    return labels;
  }

  public handleLoadMore(event: MouseEvent) {
    event.preventDefault();
    this.page++;
    this.fetchNewsTagsSummaries(true);
  }

  public get lang() {
    return this.langService.language;
  }

  private fetchNewsTagsSummaries(append: boolean = false) {
    this.loadingSummaries = true;
    this.newsService
      .getNewsTagsSummaries({ pagina: this.page, cantidad: 10 }, this.search)
      .then((summaries) => {
        if (append) {
          this.newsTagsSummaries = [...this.newsTagsSummaries, ...summaries];
          if (summaries.length === 0 || this.newsTagsSummaries.length < 10) {
            this.endOfList = true;
          } else {
            this.endOfList = false;
          }
        } else {
          this.newsTagsSummaries = summaries;
        }
        this.errorSummaries = false;
      })
      .catch((error) => {
        this.toastService.error(this.labels.errorTags[this.lang]);
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
