
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { PublicationInfo } from '../../../../../../../../services/landing/publications/publications.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { UploadOrReuseImageComponent } from '../../../../../shared/components/upload-or-reuse-image/upload-or-reuse-image.component';
import labels from './create-archive.language';

@Component({
  standalone: true,
  selector: 'app-create-archive',
  templateUrl: './create-archive.component.html',
  imports: [ReactiveFormsModule, UploadOrReuseImageComponent],
})
export class CreateArchiveComponent {
  @Output() public onCreate: EventEmitter<PublicationInfo> = new EventEmitter();
  @Output() public onCancel: EventEmitter<void> = new EventEmitter();
  public editMode: { paragraphIndex: number } | undefined = undefined;
  public paragraphs: string[] = [];
  public allImages: string[] = [];
  public creatingArchive: boolean = false;
  public uploadedPdf: SafeResourceUrl = '';
  public selectedImageIndex: number = -1;

  public formGroup: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(300)]],
    filename: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.maxLength(2000)]],
    imageName: ['', [Validators.required]],
  });

  public constructor(
    private formBuilder: FormBuilder,
    private langService: LangService,
    private sanitizer: DomSanitizer,
    private toastService: ToastrService,
    private resourcesService: ResourcesService,
  ) {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public get imageUrl() {
    return this.resourcesService.getImageUrlByName(
      'publications',
      this.formGroup.get('imageName')?.value,
    );
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

  private uploadPdf(file: File) {
    this.resourcesService
      .createFile('publications', file, file.name)
      .subscribe({
        next: (response) => {
          this.formGroup.get('filename')?.setValue(response.filename);
          this.toastService.success('Archivo subido correctamente');
        },
        error: (error) => {
          this.toastService.error('Error al subir el archivo');
        },
      });
  }

  public handleSubmit() {
    if (this.formGroup.invalid) {
      this.toastService.error('El formulario contiene campos inválidos');
      this.formGroup.markAllAsTouched();
      return;
    }
    const archiveInfo: PublicationInfo = {
      title: this.formGroup.get('title')?.value,
      imageName: this.formGroup.get('imageName')?.value,
      filename: this.formGroup.get('filename')?.value,
      description: this.formGroup.get('description')?.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      archives: [],
    };

    this.onCreate.emit(archiveInfo);
    this.formGroup.reset();
    this.uploadedPdf = '';
    this.toastService.success(labels.archiveAdded[this.lang]);
  }

  public handleCancelCreate() {
    this.onCancel.emit();
  }

  public get currentDate(): string {
    const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
    const parsedDate = new Date(
      Date.now() + timezoneOffsetInMinutes * 60 * 1000,
    );

    const navigatorLanguage = window.navigator.language || 'en-US';

    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    return parsedDate.toLocaleDateString(navigatorLanguage, options);
  }

  public handleSetPublicationArchiveImage(selectedImage: string) {
    this.formGroup.get('imageName')?.setValue(selectedImage);
  }

  public isFieldInvalid(fieldName: string): any {
    return (
      this.formGroup.get(fieldName)?.errors &&
      this.formGroup.get(fieldName)?.touched
    );
  }

  public handleCleanFields(event: MouseEvent) {
    event.preventDefault();
    this.formGroup.reset();
    this.paragraphs = [];
    this.formGroup.get('imageName')?.reset();
  }
}
