
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { NewsletterService } from '../../../../../../../../services/landing/newsletter/newsletter.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { NewsletterMonthItemComponent } from '../newsletter-month-item/newsletter-month-item.component';
import labels from './newsletter-item.lang';

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
  selector: 'app-newsletter-item',
  templateUrl: './newsletter-item.component.html',
  imports: [NewsletterMonthItemComponent],
})
export class NewsletterItemComponent {
  @Input() public newsletter!: {
    year: number;
    months: { month: number; filename: string; createdAt: Date }[];
  };
  @Output() onDeleteMonth: EventEmitter<number> = new EventEmitter<number>();
  public pdfUrl: SafeResourceUrl | undefined;
  public showPdf: boolean = false;
  public loadingDocument: boolean = false;
  public loadingMonth: number = -1;
  public errorLoadingDocument: boolean = false;

  public constructor(
    private langService: LangService,
    private resourcesService: ResourcesService,
    private newsletterService: NewsletterService,
    private sanitizer: DomSanitizer,
    private toastService: ToastrService,
  ) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleRemoveNewsletter(event: MouseEvent, month: number) {
    this.onDeleteMonth.emit(month);
  }
}
