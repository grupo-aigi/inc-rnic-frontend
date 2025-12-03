
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { NewsletterInfo } from '../../../../../../../../services/landing/newsletter/newsletter.interfaces';
import { NewsletterService } from '../../../../../../../../services/landing/newsletter/newsletter.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import labels from './create-newsletter.lang';

const months = [
  { id: 1, en: 'January', es: 'Enero' },
  { id: 2, en: 'February', es: 'Febrero' },
  { id: 3, en: 'March', es: 'Marzo' },
  { id: 4, en: 'April', es: 'Abril' },
  { id: 5, en: 'May', es: 'Mayo' },
  { id: 6, en: 'June', es: 'Junio' },
  { id: 7, en: 'July', es: 'Julio' },
  { id: 8, en: 'August', es: 'Agosto' },
  { id: 9, en: 'September', es: 'Septiembre' },
  { id: 10, en: 'October', es: 'Octubre' },
  { id: 11, en: 'November', es: 'Noviembre' },
  { id: 12, en: 'December', es: 'Diciembre' },
];

@Component({
  standalone: true,
  selector: 'app-create-newsletter',
  templateUrl: './create-newsletter.component.html',
  imports: [ReactiveFormsModule],
})
export class CreateNewsletterComponent {
  @Output() public onCreate: EventEmitter<NewsletterInfo> = new EventEmitter();
  public pdfFile: File | null = null;
  public uploadedPdf: SafeResourceUrl = '';
  public formGroup: FormGroup = this.formBuilder.group({
    year: [
      '',
      [
        Validators.required,
        Validators.min(2000),
        Validators.max(new Date().getFullYear()),
      ],
    ],
    filename: ['', [Validators.required]],
    month: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
  });

  public constructor(
    private formBuilder: FormBuilder,
    private newsletterService: NewsletterService,
    private sanitizer: DomSanitizer,
    private toastService: ToastrService,
    private langService: LangService,
    private staticResourcesService: ResourcesService,
  ) {}

  public handleSubmit() {
    if (this.formGroup.invalid) {
      this.toastService.error(labels.hasInvalidFields[this.lang]);
      this.formGroup.markAllAsTouched();
      return;
    }
    // const newsletterInfo: NewsletterInfo = {
    //   url: this.formGroup.get('url')?.value,
    //   imageName: this.formGroup.get('imageName')?.value,
    // };
    const newsletterInfo: NewsletterInfo = {
      filename: this.formGroup.get('filename')?.value,
      month: this.formGroup.get('month')?.value,
      year: this.formGroup.get('year')?.value,
    };
    this.onCreate.emit(newsletterInfo);
    this.formGroup.reset();
    this.uploadedPdf = '';
    this.pdfFile = null;
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const fileList: FileList | null = inputElement.files;
    if (!fileList) return;
    const file: File = fileList[0];
    if (!file.type.endsWith('pdf')) {
      this.toastService.error('Por favor seleccione un archivo PDF');
      return;
    }
    const blob = new Blob([file], { type: file.type });
    this.uploadedPdf = this.sanitizer.bypassSecurityTrustResourceUrl(
      URL.createObjectURL(blob),
    );
    this.uploadPdf(file);
  }

  public handleCleanFields(event: MouseEvent) {
    event.preventDefault();
    this.formGroup.reset();
    this.uploadedPdf = '';
  }

  public get months() {
    return months;
  }

  private uploadPdf(file: File) {
    this.staticResourcesService
      .createFile('newsletters', file, file.name)
      .subscribe({
        next: (response) => {
          this.formGroup.get('filename')?.setValue(response.filename);
        },
        error: (error) => {
          this.toastService.error(labels.errorUploadingFile[this.lang]);
        },
      });
  }

  public isFieldInvalid(fieldName: string): boolean | null | undefined {
    return (
      this.formGroup.get(fieldName)?.errors &&
      this.formGroup.get(fieldName)?.touched
    );
  }
}
