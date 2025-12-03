import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { formatDate } from '../../../../../../../../helpers/date-formatters';
import {
  NewsFilterCriteria,
  NewsPoster,
} from '../../../../../../../../services/landing/news/news.interfaces';
import { NewsService } from '../../../../../../../../services/landing/news/news.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { AppPagination } from '../../../../../../../../services/shared/misc/pagination.interfaces';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { CompletePaginationComponent } from '../../../../../../../landing/components/pagination/complete-pagination/complete-pagination.component';
import { NewsFilterComponent } from '../../../../../../../landing/pages/news/components/news-filters/news-filter.component';
import { DeleteNewsConfirmationComponent } from './components/delete-news-confirmation/delete-news-confirmation.component';
import labels from './list-news.lang';

@Component({
  standalone: true,
  selector: 'app-list-news',
  templateUrl: './list-news.component.html',
  imports: [
    RouterLink,
    CommonModule,
    NewsFilterComponent,
    CompletePaginationComponent,
    DeleteNewsConfirmationComponent,
  ],
})
export class ListNewsComponent implements OnInit {
  @Output() public onEditNews: EventEmitter<NewsPoster> = new EventEmitter();
  public loadingPosters: boolean = true;
  public newsPosters: NewsPoster[] = [];
  public newsPosterToDelete: NewsPoster | null = null;
  public newsImages: string[] = [];
  public filterCriteria: NewsFilterCriteria = {};
  public pagination: AppPagination = {
    totalElements: 0,
    pageSize: 10,
    currentPage: 1,
  };

  public constructor(
    private newsService: NewsService,
    private title: Title,
    private langService: LangService,
    private router: Router,
    private route: ActivatedRoute,
    private resourcesService: ResourcesService,
    private toastService: ToastrService,
  ) {}

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const { pagina } = params;
      if (!pagina) {
        this.pagination.currentPage = 1;
        this.fetchNews();
        return;
      }
      if (isNaN(+pagina)) {
        this.toastService.error(labels.invalidPage[this.lang]);
        this.router.navigate(['/'], {});
        return;
      }
      this.pagination.currentPage = +pagina;
      this.fetchNews();
    });
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  private fetchNews() {
    this.loadingPosters = true;
    this.newsService
      .fetchNewsPosters({
        pagina: this.pagination.currentPage - 1,
        cantidad: this.pagination.pageSize,
      })
      .then(({ records, count }) => {
        this.pagination.totalElements = count;
        this.processFetchedNews(records);
      });
  }

  private processFetchedNews(newsPosters: NewsPoster[]) {
    this.loadingPosters = false;
    this.newsPosters = newsPosters.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  public handleSetNewsPosterToDelete(newsPoster: NewsPoster) {
    this.newsPosterToDelete = newsPoster;
  }

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('news', name);
  }

  public handleGoToPage(page: number) {
    this.pagination.currentPage = page;
    this.router.navigate(['/intranet/gestion-contenido/noticias'], {
      fragment: 'top',
      queryParams: { pagina: page },
      queryParamsHandling: 'merge',
    });
    setTimeout(() => {
      this.fetchNews();
    }, 1000);
  }

  public updateNewsFilters(filterCriteria: NewsFilterCriteria) {
    this.filterCriteria = filterCriteria;
    this.loadingPosters = true;
    this.newsService
      .fetchNewsPosters(
        {
          pagina: this.pagination.currentPage - 1,
          cantidad: this.pagination.pageSize,
        },
        filterCriteria,
      )
      .then(({ records, count }) => {
        this.pagination.totalElements = count;
        this.processFetchedNews(records);
      });
  }

  public handleEditNews(newsPoster: NewsPoster) {
    this.onEditNews.emit(newsPoster);
  }

  public handleConfirmDelete(id: number) {
    return this.newsService.removeNewsPoster(id).then(({ id }) => {
      if (id) {
        this.newsPosters = this.newsPosters.filter(
          (newsPoster) => newsPoster.id !== id,
        );
        this.newsPosterToDelete = null;
        return this.toastService.success(
          labels.newsDeletedSuccessfully[this.lang],
        );
      }
      return this.toastService.error(labels.newsNotDeleted[this.lang]);
    });
  }

  public trimNewsDescription(description: string) {
    if (description.length > 200) {
      return description.slice(0, 200) + '...';
    }
    return description;
  }

  public formatDate(date: Date): string {
    return formatDate(date);
  }

  public wordToHexColor(word: string) {
    // Calculate a simple hash code for the word
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = word.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert the hash code to a 24-bit hex color
    const color = (hash & 0x00ffffff).toString(16).toUpperCase();

    // Pad the color with zeros if it's less than 6 characters long
    return '#' + '0'.repeat(6 - color.length) + color;
  }
}
