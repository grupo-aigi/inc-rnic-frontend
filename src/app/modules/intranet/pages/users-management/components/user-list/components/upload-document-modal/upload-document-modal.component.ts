
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { LinkingService } from '../../../../../../../../services/intranet/linking/linking.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './upload-document-modal.lang';

@Component({
  standalone: true,
  selector: 'app-upload-user-document-modal',
  templateUrl: './upload-document-modal.component.html',
  imports: [],
})
export class UploadUserDocumentComponent implements OnInit {
  public uploadedFile: File | undefined;
  @ViewChild('closeUploadPDFButton')
  public closeUploadPDFButton!: ElementRef<HTMLButtonElement>;

  @Input() public userId!: string;
  @Input() public docType!: 'LINKING_CERTIFICATE' | 'APPROVAL_LETTER';

  public constructor(
    private linkingService: LinkingService,
    private toastService: ToastrService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.uploadedFile = undefined;
  }

  public onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const fileList: FileList | null = inputElement.files;
    const allowedFormats = ['application/pdf'];

    if (!fileList) return;

    const file: File = fileList[0];
    // if (!allowedFormats.includes(file.type)) return;

    this.uploadedFile = file;
  }

  public handleConfirmUpload($event: MouseEvent) {
    $event.preventDefault();
    if (!this.uploadedFile) return;

    return this.linkingService
      .uploadUserDocument(this.userId, this.docType, this.uploadedFile)
      .subscribe({
        next: () => {
          this.closeUploadPDFButton.nativeElement.click();
          this.toastService.success(labels.documentUploaded[this.lang]);
        },
        error: (error) => {
          this.toastService.error(labels.errorUploadingDocument[this.lang]);
        },
      });
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }
}
