
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { NewsletterInfo } from '../../../../../../services/landing/newsletter/newsletter.interfaces';
import { NewsletterService } from '../../../../../../services/landing/newsletter/newsletter.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { CreateNewsletterComponent } from './components/create-newsletter/create-newsletter.component';
import { ListNewslettersComponent } from './components/list-newsletter/list-newsletters.component';
import labels from './newsletter-management-page.language';

@Component({
  standalone: true,
  templateUrl: './newsletter-management-page.component.html',
  imports: [ListNewslettersComponent, CreateNewsletterComponent],
})
export class NewsletterManagementPage {
  public activeTabIndex: number = 0;
  @ViewChild('tab0Element') public tab0Element!: ElementRef<HTMLLIElement>;

  public constructor(
    private langService: LangService,
    private title: Title,
    private newsletterService: NewsletterService,
    private toastService: ToastrService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });
  }

  public changeActiveTab(index: number): void {
    this.activeTabIndex = index;
  }

  public handleCreateNewsletter(newsletter: NewsletterInfo) {
    return this.newsletterService.createNewsletter(newsletter).subscribe({
      next: () => {
        this.toastService.success(
          labels.newsletterCreatedSuccessfully[this.langService.language],
        );
        this.tab0Element.nativeElement.click();
        this.activeTabIndex = 0;
      },
      error: () => {
        this.toastService.error(
          labels.errorCreatingNewsletter[this.langService.language],
        );
      },
    });
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }
}
