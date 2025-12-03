
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { PublicationInfo } from '../../../../../../../../services/landing/publications/publications.interfaces';
import { PublicationService } from '../../../../../../../../services/landing/publications/publications.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { UploadOrReuseImageComponent } from '../../../../../shared/components/upload-or-reuse-image/upload-or-reuse-image.component';
import { CreateArchiveComponent } from '../create-archive/create-archive.component';
import { IntranetArchiveItemComponent } from '../list-publications/components/archive-item/archive-item.component';
import labels from './create-publication.lang';

@Component({
  standalone: true,
  selector: 'app-create-publication',
  templateUrl: './create-publication.component.html',
  imports: [
    ReactiveFormsModule,
    CreateArchiveComponent,
    IntranetArchiveItemComponent,
    UploadOrReuseImageComponent
],
})
export class CreatePublicationComponent implements OnInit {
  @Output() public onSubmit: EventEmitter<PublicationInfo> = new EventEmitter();
  @Output() public onCancel: EventEmitter<void> = new EventEmitter();
  @Input() public publicationToEdit: PublicationInfo | undefined;

  public allImages: string[] = [];
  public creatingArchive: boolean = false;
  public uploadedPdf: SafeResourceUrl = '';
  public selectedImageIndex: number = -1;
  public archives: PublicationInfo[] = [];
  public loadingPublicationDetail: boolean = true;
  public attachmentUrl: string = '';

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
    private publicationsService: PublicationService,
    private router: Router,
    private staticResourcesService: ResourcesService,
    private resourcesService: ResourcesService,
  ) {}

  public ngOnInit(): void {
    if (!this.publicationToEdit) return;
    this.initializeFormValues();
  }

  private initializeFormValues() {
    this.formGroup.get('title')?.patchValue(this.publicationToEdit!.title);
    this.formGroup
      .get('filename')
      ?.patchValue(this.publicationToEdit!.filename);
    this.formGroup
      .get('description')
      ?.patchValue(this.publicationToEdit!.description);
    this.formGroup
      .get('imageName')
      ?.patchValue(this.publicationToEdit!.imageName);
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const fileList: FileList | null = inputElement.files;

    if (!fileList) return;
    const file: File = fileList[0];
    if (!file.type.includes('pdf')) {
      this.toastService.error(labels.uploadAPdfFile[this.lang]);
      return;
    }
    const blob = new Blob([file], { type: file.type });
    this.uploadedPdf = this.sanitizer.bypassSecurityTrustResourceUrl(
      URL.createObjectURL(blob),
    );
    this.uploadPdf(file);
  }

  private uploadPdf(file: File) {
    this.staticResourcesService
      .createFile('publications', file, file.name)
      .subscribe({
        next: (response) => {
          this.formGroup.get('filename')?.setValue(response.filename);
          this.toastService.success(labels.fileUploadedSuccessfully[this.lang]);
        },
        error: (error) => {
          this.toastService.error(labels.errorUploadFile[this.lang]);
        },
      });
  }

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('publications', name);
  }

  public handleAddArchive(archive: PublicationInfo) {
    this.archives.push(archive);
  }

  public handleCancelCreateArchive() {
    this.creatingArchive = false;
  }

  public handleCreateNewArchive() {
    this.creatingArchive = true;
  }

  public handleSubmit() {
    if (this.formGroup.invalid) {
      this.toastService.error(labels.formHasInvalidFields[this.lang]);
      this.formGroup.markAllAsTouched();
      return;
    }

    const publicationInfo: PublicationInfo = {
      id: this.publicationToEdit?.id,
      title: this.formGroup.get('title')?.value,
      filename: this.formGroup.get('filename')?.value,
      description: this.formGroup.get('description')?.value,
      imageName: this.formGroup.get('imageName')?.value,
      archives: this.archives,
    };

    this.onSubmit.emit(publicationInfo);
    // this.formGroup.reset();
    // this.paragraphs = [];
  }

  public handleCancelUpdate(event: MouseEvent) {
    event.preventDefault();
    this.onCancel.emit();
  }

  public get currentDate(): string {
    const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
    const parsedDate = new Date(
      Date.now() + timezoneOffsetInMinutes * 60 * 1000,
    );

    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    return parsedDate.toLocaleDateString(this.lang, options);
  }

  public handleSetPublicationImage(selectedImage: string) {
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
    this.formGroup.get('imageName')?.reset();
  }
}
