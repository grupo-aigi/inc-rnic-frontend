import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { formatDate } from '../../../../../../../helpers/date-formatters';
import { PublicationInfo } from '../../../../../../../services/landing/publications/publications.interfaces';
import { PublicationService } from '../../../../../../../services/landing/publications/publications.service';
import { ResourcesService } from '../../../../../../../services/shared/resources/resource.service';

import labels from './archive-item.lang';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';

@Component({
  standalone: true,
  selector: 'app-archive-item',
  templateUrl: './archive-item.component.html',
  imports: [],
})
export class ArchiveItemComponent implements OnInit {
  @Input() public archive!: PublicationInfo;
  public displayPdfDocument: boolean = false;
  public loadingDocument: boolean = false;
  public errorDocument: boolean = false;
  public pdfDocument: SafeResourceUrl = '';
  public archiveImage: string = '';
  public errorImage: boolean = false;
  public loadingImage: boolean = true;
  public attachmentUrl: string = '';

  public constructor(
    private langService: LangService,
    private publicationService: PublicationService,
    private sanitizer: DomSanitizer,
    private toastService: ToastrService,
    private resourcesService: ResourcesService,
  ) {}

  public ngOnInit(): void {
    this.getImageUrlByName();
    this.attachmentUrl = this.publicationService.getAttachmentUrl(
      this.archive.filename,
      this.convertTitleToSlug(this.archive.title),
    );
  }

  private convertTitleToSlug(title: string): string {
    return (
      title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^a-z0-9-]/g, '') + '.pdf'
    );
  }

  public formatDate(date: Date): string {
    return formatDate(date);
  }

  public handleFetchPdf() {
    this.displayPdfDocument = true;
    this.loadingDocument = true;
    this.errorDocument = false;
    return this.publicationService
      .fetchSummaryPdfDocument(this.archive.filename)
      .then((response) => {
        const pdfData = new Blob([response], {
          type: 'application/pdf',
        });
        this.pdfDocument = this.sanitizer.bypassSecurityTrustResourceUrl(
          URL.createObjectURL(pdfData),
        );
      })
      .catch((err) => {
        this.errorDocument = true;
      })
      .finally(() => {
        this.loadingDocument = false;
      });
  }

  public hideDocument() {
    this.displayPdfDocument = false;
    this.pdfDocument = '';
  }

  public getImageUrlByName() {
    return this.resourcesService.getImageUrlByName(
      'publications',
      this.archive.imageName,
    );
  }
  public get lang() {
    return this.langService.language;
  }
  public get labels() {
    return labels;
  }
}
