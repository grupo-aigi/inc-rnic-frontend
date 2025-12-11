import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ScientificEcosystemDetailMembers } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { GridImageComponent } from '../../../../../shared/components/grid-images/grid-images.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ScientificEcosystemService } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.service';

@Component({
  standalone: true,
  templateUrl: './scientific-ecosystem-members.component.html',
  imports: [ReactiveFormsModule, GridImageComponent],
  selector: 'app-scientific-ecosystem-members',
})
export class ScientificEcosystemMembersComponent {
  @Input() section!: ScientificEcosystemDetailMembers;

  public displayPdfDocument: boolean = false;
  public loadingDocument: boolean = false;
  public errorDocument: boolean = false;
  public pdfDocument: SafeResourceUrl = '';
  public archiveImage: string = '';
  public errorImage: boolean = false;
  public loadingImage: boolean = true;
  public attachmentUrl: string = '';

  public constructor(
    private resourcesService: ResourcesService,
    private sanitizer: DomSanitizer,
    private scientificEcosystemService: ScientificEcosystemService,
  ) {}

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('ecosystems', name);
  }

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
