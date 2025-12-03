
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { NewsService } from '../../../../../../services/landing/news/news.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './news-monthly-summaries-modal.lang';

type Month = { id: number; en: string; es: string; count: number };

const months: Month[] = [
  { id: 1, en: 'January', es: 'Enero', count: 0 },
  { id: 2, en: 'February', es: 'Febrero', count: 0 },
  { id: 3, en: 'March', es: 'Marzo', count: 0 },
  { id: 4, en: 'April', es: 'Abril', count: 0 },
  { id: 5, en: 'May', es: 'Mayo', count: 0 },
  { id: 6, en: 'June', es: 'Junio', count: 0 },
  { id: 7, en: 'July', es: 'Julio', count: 0 },
  { id: 8, en: 'August', es: 'Agosto', count: 0 },
  { id: 9, en: 'September', es: 'Septiembre', count: 0 },
  { id: 10, en: 'October', es: 'Octubre', count: 0 },
  { id: 11, en: 'November', es: 'Noviembre', count: 0 },
  { id: 12, en: 'December', es: 'Diciembre', count: 0 },
];

@Component({
  standalone: true,
  selector: 'app-news-monthly-summaries-modal',
  templateUrl: './news-monthly-summaries-modal.component.html',
  imports: [RouterLink],
})
export class NewsMonthlySummariesModalComponent implements OnInit {
  public loadingSummaries = false;
  public errorSummaries = false;
  public yearlySummaries: { year: number; months: Month[] }[] = [];
  @ViewChild('closeModalBtn')
  public closeModalBtn!: ElementRef<HTMLButtonElement>;

  public constructor(
    private newsService: NewsService,
    private langService: LangService,
    private toastService: ToastrService,
  ) {}

  public ngOnInit() {
    this.fetchYearlySummaries();
  }

  private fetchYearlySummaries() {
    return this.newsService
      .fetchYearlySummaries()
      .then((summaries) => {
        this.errorSummaries = false;
        this.yearlySummaries = summaries.map(({ year, monthlyQuantities }) => ({
          year,
          months: monthlyQuantities
            .map(({ month, count }) => ({
              id: month,
              en: months.find((m) => m.id === month)!.en,
              es: months.find((m) => m.id === month)!.es,
              count,
            }))
            .reverse(),
        }));
      })
      .catch(() => {
        this.toastService.error('Error fetching news summaries');
        this.errorSummaries = true;
      })
      .finally(() => {
        this.loadingSummaries = false;
      });
  }

  public get months() {
    return months;
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public handleRetryFetch() {
    this.fetchYearlySummaries();
  }
}
