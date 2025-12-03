
import { AfterViewInit, Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import { AuthService } from '../../../../../../services/auth/auth.service';
import { LinkingService } from '../../../../../../services/intranet/linking/linking.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './net-carnet.lang';

@Component({
  standalone: true,
  selector: 'app-net-carnet',
  templateUrl: './net-carnet.component.html',
  styleUrls: ['./net-carnet.component.scss'],
  imports: [],
})
export class NetCarnetComponent implements AfterViewInit {
  public loading: boolean = false;
  public error: boolean = false;
  public netCarnetPdfUrl: SafeResourceUrl = '';
  public pdfUrl: SafeResourceUrl = '';

  public constructor(
    private sanitizer: DomSanitizer,
    private linkingService: LinkingService,
    private langService: LangService,
    private authService: AuthService,
  ) {}

  public get identification() {
    return this.authService.userInfo!.identification;
  }

  public get fullName() {
    return this.authService.userInfo!.name;
  }

  public get registeredYear() {
    return new Date(this.authService.userInfo!.createdAt)
      .toISOString()
      .split('-')[0];
  }

  public ngAfterViewInit(): void {
    this.loading = true;
    this.error = false;

    this.convertToPdf().then((file) => {
      if (!file) return;
      return this.signDocument(file);
    });
  }

  private signDocument(file: File): Promise<void> {
    return this.linkingService
      .signPdfDocument(file)
      .then((response) => {
        const pdfData = new Blob([response], {
          type: 'application/pdf',
        });
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          URL.createObjectURL(pdfData),
        );
        this.loading = false;
      })
      .catch((err) => {
        this.loading = false;
        this.error = true;
      });
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public convertToPdf(): Promise<File | void> {
    const divId = 'div_id';
    const doc = new jsPDF({
      orientation: 'landscape',
      format: 'a4',
      unit: 'cm',
    });
    const data = document.getElementById(divId);
    if (!data) {
      throw new Error('No se pudo obtener el elemento');
    }
    return html2canvas(data).then((canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');
      doc.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);
      const pdfBlob = doc.output('blob');

      return new File([pdfBlob], 'generated-pdf.pdf', {
        type: 'application/pdf',
      });
    });
  }
}
