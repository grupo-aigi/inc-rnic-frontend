
import { Component, OnInit } from '@angular/core';
import {
  DomSanitizer,
  SafeResourceUrl,
  Title,
} from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { formatDate } from '../../../../../helpers/date-formatters';
import { PublicationInfo } from '../../../../../services/landing/publications/publications.interfaces';
import { PublicationService } from '../../../../../services/landing/publications/publications.service';
import { LangService } from '../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../services/shared/resources/resource.service';
import { ArchiveItemComponent } from './components/archive-item/archive-item.component';
import labels from './publication-detail-page.lang';

@Component({
  standalone: true,
  templateUrl: './publication-detail-page.component.html',
  imports: [ArchiveItemComponent, RouterLink],
})
export class PublicationDetailPage implements OnInit {
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  public urlName: string = '';
  public publicationDetail: PublicationInfo | null = null;
  public displaySummaryPdf: boolean = false;
  public summaryPdf: SafeResourceUrl = '';
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
    private title: Title,
    private resourcesService: ResourcesService,
  ) {}

  public ngOnInit(): void {
    if (location.href.includes('/intranet')) {
      this.variant = 'INTRANET';
    }
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
              this.convertTitleToSlug(this.publicationDetail.title),
            );
            this.setUpTitle();
          },
          error: (error) => {
            this.loadingPublicationDetail = false;
            return this.router.navigate(['/not-found']);
          },
        });
    });
  }

  private convertTitleToSlug(title: string): string {
    return (
      title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^a-z0-9-]/g, '') + '.pdf'
    );
  }

  private setUpTitle() {
    this.title.setTitle(
      `${this.publicationDetail!.title} | ${labels.pageTitleSuffix[this.lang]}`,
    );
  }

  public get imageUrl() {
    return this.resourcesService.getImageUrlByName(
      'publications',
      this.publicationDetail!.imageName,
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

  public formatDate(date: Date): string {
    return formatDate(date);
  }
}
