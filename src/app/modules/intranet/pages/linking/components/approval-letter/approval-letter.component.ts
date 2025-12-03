
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { LinkingService } from '../../../../../../services/intranet/linking/linking.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './approval-letter.lang';

@Component({
  standalone: true,
  selector: 'app-approval-letter',
  templateUrl: './approval-letter.component.html',
  imports: [],
})
export class ApprovalLetterComponent implements OnInit {
  public loading: boolean = false;
  public error: boolean = false;
  public approvalLetterPdfUrl: SafeResourceUrl = '';
  public pdfUrl: SafeResourceUrl = '';

  public constructor(
    private linkingService: LinkingService,
    private sanitizer: DomSanitizer,
    private langService: LangService,
  ) {}

  public ngOnInit() {
    this.loading = true;
    this.error = false;
    this.linkingService.fetchOwnedUserDocument('APPROVAL_LETTER').subscribe({
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
