import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ScientificEcosystemDetailRoadmap } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { formatDate } from '../../../../../../../../helpers/date-formatters';
import { ScientificEcosystemService } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.service';

@Component({
  standalone: true,
  selector: 'app-scientific-ecosystem-roadmap',
  templateUrl: './scientific-ecosystem-roadmap.component.html',
  imports: [],
})
export class ScientificEcosystemRoadmapComponent {
  @Input() section!: ScientificEcosystemDetailRoadmap;

  public displayPdfDocument: boolean = false;
  public loadingDocument: boolean = false;
  public errorDocument: boolean = false;
  public pdfDocument: SafeResourceUrl = '';
  public archiveImage: string = '';
  public errorImage: boolean = false;
  public loadingImage: boolean = true;
  public attachmentUrl: string = '';

  public constructor(
    private sanitizer: DomSanitizer,
    private resourcesService: ResourcesService,
    private scientificEcosystemService: ScientificEcosystemService,
  ) {}

  public ngOnInit(): void {
    // this.attachmentUrl = this.scientificEcosystemService.getAttachmentUrl(
    //   this.archive.filename,
    //   this.convertTitleToSlug(this.archive.title),
    // );
  }

  private convertTitleToSlug(title: string): string {
    return (
      title
        .toLowerCase()
        .trim()
        .replace(/ /g, '-')
        .replace(/[^a-z0-9-]/g, '') + '.pdf'
    );
  }

  public formatDate(date: Date): string {
    return formatDate(date);
  }

  public handleFetchPdf(filename: string) {
    this.displayPdfDocument = true;
    this.loadingDocument = true;
    this.errorDocument = false;
    return this.scientificEcosystemService
      .fetchPdfDocument(filename)
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
}
