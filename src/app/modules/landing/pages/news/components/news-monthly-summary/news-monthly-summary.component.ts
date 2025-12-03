
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NewsService } from '../../../../../../services/landing/news/news.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { NewsMonthlySummariesModalComponent } from '../news-monthly-summaries-modal/news-monthly-summaries-modal.component';
import labels from './news-monthly-summary.lang';

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
  selector: 'app-news-monthly-summary',
  templateUrl: './news-monthly-summary.component.html',
  imports: [RouterLink, NewsMonthlySummariesModalComponent],
})
export class NewsMonthlySummaryComponent implements OnInit {
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  public currentYearTimeline: {
    year: number;
    months: Month[];
  };

  public constructor(
    private langService: LangService,
    private newsService: NewsService,
  ) {
    this.currentYearTimeline = {
      year: new Date().getFullYear(),
      months: this.monthsInCurrentYear(),
    };
  }

  public ngOnInit(): void {
    if (location.href.includes('/intranet')) {
      this.variant = 'INTRANET';
    }
    this.newsService
      .fetchYearlySummaries(new Date().getFullYear())
      .then((summaries) => {
        const currentYear = summaries.find(
          (summary) => summary.year === new Date().getFullYear(),
        );
        if (!currentYear) return;

        this.currentYearTimeline.months = this.currentYearTimeline.months
          .map((month) => {
            const monthSummary = currentYear.monthlyQuantities.find(
              (summary) => summary.month === month.id,
            );
            if (monthSummary) {
              month.count = monthSummary.count;
            }
            return month;
          })
          .filter((month) => month.count > 0)
          .reverse();
      });
  }

  public monthsInCurrentYear(): Month[] {
    const currentMonth = new Date().getMonth();
    return months.slice(0, currentMonth + 1);
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public getSummaryLink(currentYear: number, monthId: number) {
    // Year: 2020, Month: 3 --> Return: desde=2020-03-01&hasta=2020-04-01
    const startDate = new Date(currentYear, monthId - 1, 1)
      .toISOString()
      .split('T')[0];
    const endDate = new Date(currentYear, monthId, 1)
      .toISOString()
      .split('T')[0];
    return `?desde=${startDate}&hasta=${endDate}`;
  }
}
