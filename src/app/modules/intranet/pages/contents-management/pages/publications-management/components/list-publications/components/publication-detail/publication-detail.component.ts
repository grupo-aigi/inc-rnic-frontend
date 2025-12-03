
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { PublicationInfo } from '../../../../../../../../../../services/landing/publications/publications.interfaces';
import { PublicationService } from '../../../../../../../../../../services/landing/publications/publications.service';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../../../services/shared/resources/resource.service';
import { ArchiveItemComponent } from '../../../../../../../../../landing/pages/publications/publication-detail/components/archive-item/archive-item.component';
import labels from './publication-detail.lang';

@Component({
  standalone: true,
  templateUrl: './publication-detail.component.html',
  imports: [ArchiveItemComponent],
})
export class IntranetPublicationDetailComponent implements OnInit {
  public urlName: string = '';
  public publicationDetail: PublicationInfo | null = null;
  public displaySummaryPdf: boolean = false;
  public summaryPdf: SafeResourceUrl = '';
  public summaryImage: string = '';
  public loadingPublicationDetail: boolean = false;
  public errorPublicationDetail: boolean = false;
  public loadingDocument: boolean = false;
  public errorDocument: boolean = false;
  public attachmentUrl = '';

  public constructor(
    private langService: LangService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private publicationService: PublicationService,
    private router: Router,
    private resourcesService: ResourcesService,
  ) {}

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.urlName = params.get('urlName') ?? '';
      if (!this.urlName) {
        return this.router.navigate(['/not-found']);
      }
      this.loadingPublicationDetail = true;
      return this.publicationService
        .fetchPublicationDetail(this.urlName)
        .subscribe({
          next: (publicationDetail) => {
            this.publicationDetail = publicationDetail;
            this.attachmentUrl = this.publicationService.getAttachmentUrl(
              this.publicationDetail.filename,
            );
          },
          error: (error) => {
            this.loadingPublicationDetail = false;
            return this.router.navigate(['/not-found']);
          },
        });
    });
  }

  public get publicationImageUrl() {
    if (!this.publicationDetail) return '';
    return this.resourcesService.getImageUrlByName(
      'publications',
      this.publicationDetail.imageName,
    );
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleFetchSummaryPdf() {
    this.loadingDocument = true;
    this.errorDocument = false;
    return this.publicationService
      .fetchSummaryPdfDocument(this.publicationDetail!.filename)
      .then((response) => {
        const pdfData = new Blob([response], {
          type: 'application/pdf',
        });
        this.summaryPdf = this.sanitizer.bypassSecurityTrustResourceUrl(
          URL.createObjectURL(pdfData),
        );
      })
      .catch((err) => {
        this.errorDocument = true;
      })
      .finally(() => {
        this.displaySummaryPdf = true;
        this.loadingDocument = false;
      });
  }

  public hideDocument() {
    this.displaySummaryPdf = false;
    this.summaryPdf = '';
  }

  public formatDate(dateString: string): string {
    const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
    const parsedDate = new Date(
      new Date(dateString).getTime() + timezoneOffsetInMinutes * 60 * 1000,
    );

    const navigatorLanguage = window.navigator.language || 'en-US';

    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    return parsedDate.toLocaleDateString(navigatorLanguage, options);
  }
}
