
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { LinkingService } from '../../../../../../services/intranet/linking/linking.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './my-linking.lang';

@Component({
  standalone: true,
  selector: 'app-my-linking',
  templateUrl: './my-linking.component.html',
  imports: [],
})
export class MyLinkingComponent implements OnInit {
  @ViewChild('pdfFrame') public pdfFrame!: ElementRef<HTMLIFrameElement>;
  public loading: boolean = false;
  public error: boolean = false;
  public myLinkingPdfUrl: SafeResourceUrl = '';
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
      .fetchLinkingPDF()
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
}
