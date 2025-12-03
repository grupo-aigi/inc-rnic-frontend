import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


import { LinkingService } from '../../../../../../services/intranet/linking/linking.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './linking-certificate.lang';

@Component({
  standalone: true,
  selector: 'app-linking-certificate',
  templateUrl: './linking-certificate.component.html',
  imports: [],
})
export class LinkingCertificateComponent implements OnInit {
  public loading: boolean = false;
  public error: boolean = false;
  public linkingCertificatePdfUrl: SafeResourceUrl = '';
  public pdfUrl: SafeResourceUrl = '';

  public constructor(
    private linkingService: LinkingService,
    private sanitizer: DomSanitizer,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.loading = true;
    this.error = false;
    this.linkingService
      .fetchOwnedUserDocument('LINKING_CERTIFICATE')
      .subscribe({
        next: (response) => {
          const pdfData = new Blob([response], {
            type: 'application/pdf',
          });
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(pdfData),
          );
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error = true;
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
