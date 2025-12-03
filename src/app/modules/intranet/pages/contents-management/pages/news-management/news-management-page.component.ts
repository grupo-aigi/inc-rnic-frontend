
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import {
  NewsCreateInfo,
  NewsPoster,
} from '../../../../../../services/landing/news/news.interfaces';
import { NewsService } from '../../../../../../services/landing/news/news.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { CreateNewsComponent } from './components/create-news/create-news.component';
import { ListNewsComponent } from './components/list-news/list-news.component';
import labels from './news-management-page.language';

@Component({
  standalone: true,
  templateUrl: './news-management-page.component.html',
  imports: [ListNewsComponent, CreateNewsComponent],
})
export class NewsManagementPage {
  @ViewChild('allNewsTab') public allNewsTab!: ElementRef<HTMLLIElement>;
  public activeTabIndex: number = 0;

  public newsToEdit: NewsPoster | undefined;

  public constructor(
    private title: Title,
    private langService: LangService,
    private toastService: ToastrService,
    private newsService: NewsService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });
  }

  public handleRedirectToNewsTab() {
    this.allNewsTab.nativeElement.click();
    this.activeTabIndex = 1;
  }

  public changeActiveTab(index: number): void {
    if (index === 0 && this.newsToEdit) {
      this.newsToEdit = undefined;
    }
    this.activeTabIndex = index;
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleCancelUpdate() {
    this.toastService.info(labels.updateCancelled[this.lang]);
    this.newsToEdit = undefined;
    this.changeActiveTab(0);
    this.allNewsTab.nativeElement.click();
  }

  public handleEditNews(news: NewsPoster) {
    this.newsToEdit = news;
    this.changeActiveTab(1);
  }

  public submitNews(newsInfo: NewsCreateInfo) {
    if (this.newsToEdit) {
      return this.newsService.updateNews(newsInfo).subscribe({
        next: (value) => {
          this.toastService.success(labels.newsUpdatedSuccessfully[this.lang]);
          this.allNewsTab.nativeElement.click();
          this.activeTabIndex = 0;
          this.newsToEdit = undefined;
        },
        error: (_err) => {
          this.toastService.error(this.labels.errorUpdatingNews[this.lang]);
        },
      });
    }

    return this.newsService.createNews(newsInfo).subscribe({
      next: (value) => {
        this.toastService.success(labels.newsCreatedSuccessfully[this.lang]);
        this.allNewsTab.nativeElement.click();
        this.activeTabIndex = 0;
      },
      error: (_err) => {
        this.toastService.error(this.labels.errorCreatingNews[this.lang]);
      },
    });
  }
}
