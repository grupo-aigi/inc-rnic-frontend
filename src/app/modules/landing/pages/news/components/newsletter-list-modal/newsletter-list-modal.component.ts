
import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { NewsletterInfo } from '../../../../../../services/landing/newsletter/newsletter.interfaces';
import { NewsletterService } from '../../../../../../services/landing/newsletter/newsletter.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';
import labels from './newsletter-list-modal.lang';

const months = [
  { id: 1, en: 'January', es: 'Enero' },
  { id: 2, en: 'February', es: 'Febrero' },
  { id: 3, en: 'March', es: 'Marzo' },
  { id: 4, en: 'April', es: 'Abril' },
  { id: 5, en: 'May', es: 'Mayo' },
  { id: 6, en: 'June', es: 'Junio' },
  { id: 7, en: 'July', es: 'Julio' },
  { id: 8, en: 'August', es: 'Agosto' },
  { id: 9, en: 'September', es: 'Septiembre' },
  { id: 10, en: 'October', es: 'Octubre' },
  { id: 11, en: 'November', es: 'Noviembre' },
  { id: 12, en: 'December', es: 'Diciembre' },
];

@Component({
  standalone: true,
  selector: 'app-newsletter-list-modal',
  templateUrl: './newsletter-list-modal.component.html',
  imports: [],
})
export class NewsletterListModalComponent implements OnInit {
  public newsletters: {
    year: number;
    months: { month: number; filename: string; createdAt: Date }[];
  }[] = [];

  public constructor(
    private newsletterService: NewsletterService,
    private resourcesService: ResourcesService,
    private langService: LangService,
    private toastService: ToastrService,
  ) {}
  public ngOnInit(): void {
    const currYear = new Date().getFullYear();

    this.newsletterService
      .fetchNewslettersSummaries(2000, currYear)
      .subscribe((value) => {
        this.newsletters = this.parseNewsletters(value);
      });
  }

  private parseNewsletters(newsletters: NewsletterInfo[]) {
    const uniqueYears = Array.from(
      new Set(newsletters.map((newsletter) => newsletter.year)),
    );
    return uniqueYears
      .map((year) => {
        return {
          year,
          months: newsletters
            .filter((newsletter) => newsletter.year === year)
            .map((newsletter) => ({
              month: newsletter.month,
              filename: newsletter.filename,
              createdAt: new Date(newsletter.createdAt!),
            }))
            .sort((a, b) => a.month - b.month),
        };
      })
      .sort((a, b) => b.year - a.year);
  }

  public getMonthName(month: number) {
    return months.find((m) => m.id === month)![this.lang];
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public downloadFile(filename: string, year: number, month: number) {
    const originalFilename = `${
      labels.newsletter[this.lang]
    }-${this.getMonthName(month)}-${year}.pdf`;

    return this.resourcesService
      .fetchFileById('newsletters', filename)
      .subscribe({
        next: (value) => {
          const blob = new Blob([value], {
            type: 'application/octet-stream',
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = originalFilename;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          this.toastService.error(labels.errorFile[this.lang]);
        },
      });
  }
}
