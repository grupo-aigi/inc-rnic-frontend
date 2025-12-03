import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';


import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import labels from './newsletter-month-item.lang';
import { formatDate } from '../../../../../../../../helpers/date-formatters';

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
  selector: 'app-newsletter-month-item',
  templateUrl: './newsletter-month-item.component.html',
  imports: [],
})
export class NewsletterMonthItemComponent {
  @Input() public month!: { month: number; filename: string; createdAt: Date };

  public pdfUrl: SafeResourceUrl | undefined;
  public showPdf: boolean = false;
  public loadingDocument: boolean = false;
  public loadingMonth: number = -1;
  public errorLoadingDocument: boolean = false;

  public constructor(
    private langService: LangService,
    private resourcesService: ResourcesService,
    private sanitizer: DomSanitizer,
    private toastService: ToastrService,
  ) {}

  public getMonthName(month: number) {
    return months.find((m) => m.id === month)![this.lang];
  }

  public get lang() {
    return this.langService.language;
  }

  public formatDate(date: Date): string {
    return formatDate(date);
  }

  public get labels() {
    return labels;
  }

  public handleShowPdf(event: MouseEvent, filename: string, month: number) {
    event.preventDefault();
    this.loadingMonth = month;
    this.loadingDocument = true;
    this.errorLoadingDocument = false;
    lastValueFrom(this.resourcesService.fetchFileById('newsletters', filename))
      .then((response) => {
        const pdfData = new Blob([response], {
          type: 'application/pdf',
        });
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          URL.createObjectURL(pdfData),
        );
        this.showPdf = true;
      })
      .catch(() => {
        this.toastService.error(labels.errorLoadingPdf[this.lang]);
        this.errorLoadingDocument = true;
      })
      .finally(() => {
        this.loadingDocument = false;
        this.loadingMonth = -1;
      });
  }

  public handleHidePdf(event: MouseEvent) {
    event.preventDefault();
    this.pdfUrl = undefined;
    this.showPdf = false;
  }
}
