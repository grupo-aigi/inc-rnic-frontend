
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../../../../../../services/auth/auth.service';
import { LinkingService } from '../../../../../../../../services/intranet/linking/linking.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './upload-documents-buttons.lang';

@Component({
  standalone: true,
  selector: 'app-upload-documents-buttons',
  templateUrl: './upload-documents-buttons.component.html',
  imports: [],
})
export class UploadDocumentsButtonsComponent implements OnInit {
  @Input() public userId!: string;
  @Input() public active!: boolean;
  public docType: 'LINKING_CERTIFICATE' | 'APPROVAL_LETTER' =
    'LINKING_CERTIFICATE';
  public linkingCertificateName: string = '';
  public approvalLetterName: string = '';
  @ViewChild('uploadDocumentInput')
  public uploadDocumentInput!: ElementRef<HTMLInputElement>;
  public uploadedFile: File | null = null;
  public loadingDocument: boolean = false;
  public errorLoadingDocument: boolean = false;
  public pdfUrl: SafeResourceUrl = '';

  public constructor(
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private languageService: LangService,
    private linkingService: LinkingService,
    private toastService: ToastrService,
  ) {}

  public ngOnInit(): void {
    this.linkingService
      .getUserDocumentNameByUserId(this.userId, 'APPROVAL_LETTER')
      .subscribe({
        next: (response) => {
          const { name } = response;
          this.approvalLetterName = name;
        },
        error: (err) => {
          this.approvalLetterName = 'NOT_FOUND';
        },
      });
    this.linkingService
      .getUserDocumentNameByUserId(this.userId, 'LINKING_CERTIFICATE')
      .subscribe({
        next: (response) => {
          const { name } = response;
          this.linkingCertificateName = name;
        },
        error: (err) => {
          this.linkingCertificateName = 'NOT_FOUND';
        },
      });
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.languageService.language;
  }

  public handleSetActiveDocType(
    value: 'LINKING_CERTIFICATE' | 'APPROVAL_LETTER',
  ) {
    this.docType = value;
    this.uploadDocumentInput.nativeElement.click();
  }

  public handleHideDocument() {
    this.pdfUrl = '';
  }

  public handleDisplayDocument(
    value: 'LINKING_CERTIFICATE' | 'APPROVAL_LETTER',
  ) {
    this.loadingDocument = true;
    this.errorLoadingDocument = false;
    this.linkingService
      .fetchUserDocumentByUserId(this.userId, value)
      .subscribe({
        next: (response) => {
          const pdfData = new Blob([response], {
            type: 'application/pdf',
          });
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(pdfData),
          );
        },
        error: (err) => {
          this.errorLoadingDocument = true;
        },
        complete: () => {
          this.loadingDocument = false;
        },
      });
  }

  public getLastUpdateFromName(name: string) {
    // certificate-test3@gmail.com_date_1705614833970.pdf
    const array = name.split('_');
    const lastPosition = array[array.length - 1];
    const date = lastPosition.split('.')[0];
    const dateObj = new Date(parseInt(date));

    const navigatorLanguage = window.navigator.language || 'en-US';

    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    return dateObj.toLocaleDateString(navigatorLanguage, options);
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
          this.toastService.success(
            labels.documentUploadedSuccessfully[this.lang],
          );
          this.uploadedFile = null;
          this.ngOnInit();
        },
        error: (error) => {
          this.toastService.error(labels.errorUploadingDocument[this.lang]);
        },
      });
  }

  public handleCancelUpload(event: MouseEvent) {
    event.preventDefault();
    this.uploadedFile = null;
  }
}
