import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';

import { formatDate } from '../../../../helpers/date-formatters';
import {
  NewsFilterCriteria,
  NewsPoster,
} from '../../../../services/landing/news/news.interfaces';
import { NewsService } from '../../../../services/landing/news/news.service';
import { LangService } from '../../../../services/shared/lang/lang.service';
import { AppPagination } from '../../../../services/shared/misc/pagination.interfaces';
import { ResourcesService } from '../../../../services/shared/resources/resource.service';
import { CompletePaginationComponent } from '../../components/pagination/complete-pagination/complete-pagination.component';
import { NewsFilterComponent } from './components/news-filters/news-filter.component';
import { NewsRightSidebarComponent } from './components/news-sidebar-menu/news-right-sidebar.component';
import labels from './news-page.lang';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-news-page',
  templateUrl: './news-page.component.html',
  imports: [
    CommonModule,
    RouterLink,
    NewsFilterComponent,
    NewsRightSidebarComponent,
    CompletePaginationComponent,
  ],
})
export class NewsPage implements OnInit {
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  public newsPosters: NewsPoster[] = [];
  public loadingNews: boolean = true;
  public error: boolean = false;
  public filterCriteria: NewsFilterCriteria = {};
  public showMobileSidebar: boolean = false;
  public pagination: AppPagination = {
    totalElements: 0,
    pageSize: 10,
    currentPage: 1,
  };

  public constructor(
    private title: Title,
    private router: Router,
    private langService: LangService,
    private newsService: NewsService,
    private resourcesService: ResourcesService,
  ) {}

  public ngOnInit(): void {
    if (location.href.includes('/intranet')) {
      this.variant = 'INTRANET';
    }
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleToggleMobileSidebar() {
    this.showMobileSidebar = !this.showMobileSidebar;
  }

  public handleGoToPage(page: number) {
    this.pagination.currentPage = page;
    this.router.navigate(['/noticias'], {
      fragment: 'top',
      queryParams: { pagina: page },
      queryParamsHandling: 'merge',
    });
    this.fetchNewsPosters();
  }

  private fetchNewsPosters() {
    this.loadingNews = true;
    this.error = false;
    this.newsService
      .fetchNewsPosters({
        pagina: this.pagination.currentPage - 1,
        cantidad: this.pagination.pageSize,
      })
      .then(({ records, count }) => {
        this.pagination.totalElements = count;
        this.newsPosters = records;
      })
      .catch(() => {
        this.error = true;
      })
      .finally(() => {
        this.loadingNews = false;
      });
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

  public updateNewsFilters(filterCriteria: NewsFilterCriteria) {
    this.filterCriteria = filterCriteria;
    this.fetchNewsPosters();
  }

  public trimNewsDescription(description: string) {
    if (description.length > 200) {
      return description.slice(0, 200) + '...';
    }
    return description;
  }

  public formatNewsDate(date: Date): string {
    return formatDate(date);
  }

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('news', name);
  }

  public trim(str: string, length: number = 50): string {
    return str.length > length ? str.slice(0, length) + '...' : str;
  }
}
