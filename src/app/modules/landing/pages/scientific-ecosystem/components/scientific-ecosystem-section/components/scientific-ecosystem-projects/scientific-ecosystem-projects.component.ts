import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ScientificEcosystemDetailProjects } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { ScientificEcosystemService } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.service';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { GridImageComponent } from '../../../../../shared/components/grid-images/grid-images.component';

@Component({
  standalone: true,
  selector: 'app-scientific-ecosystem-projects',
  templateUrl: './scientific-ecosystem-projects.component.html',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, GridImageComponent],
})
export class ScientificEcosystemProjectsComponent {
  @Input() section!: ScientificEcosystemDetailProjects;

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
