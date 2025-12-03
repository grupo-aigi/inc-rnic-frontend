
import { Component } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { NewsletterInfo } from '../../../../../../../../services/landing/newsletter/newsletter.interfaces';
import { NewsletterService } from '../../../../../../../../services/landing/newsletter/newsletter.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { NewsletterItemComponent } from '../newsletter-item/newsletter-item.component';
import labels from './list-newsletters.lang';

@Component({
  standalone: true,
  selector: 'app-list-newsletters',
  templateUrl: './list-newsletters.component.html',
  imports: [NewsletterItemComponent],
})
export class ListNewslettersComponent {
  public loadingNewsletters: boolean = true;
  public newsletters: {
    year: number;
    months: { id: number; month: number; filename: string; createdAt: Date }[];
  }[] = [];

  public constructor(
    private newsletterService: NewsletterService,
    private toastService: ToastrService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    const currYear = new Date().getFullYear();

    this.newsletterService.fetchNewslettersSummaries(2000, currYear).subscribe({
      next: (value) => {
        this.newsletters = this.parseNewsletters(value);
        this.loadingNewsletters = false;
      },
      error: (err) => {
        this.toastService.error(labels.errorLoadingNewsletters[this.lang]);
        this.loadingNewsletters = false;
      },
    });
  }

  public handleDeletedNewsletter(year: number, month: number) {
    const newsletterToDelete = this.newsletters.find(
      (newsletter) => newsletter.year === year,
    );
    const monthToDelete = newsletterToDelete?.months.find(
      (m) => m.month === month,
    );
    if (!newsletterToDelete || !monthToDelete) {
      return;
    }
    return this.newsletterService
      .deleteNewsletter(monthToDelete.id)
      .then(() => {
        this.toastService.success(
          labels.newsletterDeletedSuccessfully[this.lang],
        );
        this.newsletters = this.newsletters.map((newsletter) => {
          if (newsletter.year === year) {
            return {
              ...newsletter,
              months: newsletter.months.filter((m) => m.month !== month),
            };
          }
          return newsletter;
        });
      })
      .catch(() => {
        this.toastService.error(labels.errorDeletingNewsletter[this.lang]);
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
              id: newsletter.id!,
              month: newsletter.month,
              filename: newsletter.filename,
              createdAt: new Date(newsletter.createdAt!),
            }))
            .sort((a, b) => a.month - b.month),
        };
      })
      .sort((a, b) => b.year - a.year);
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }
}
