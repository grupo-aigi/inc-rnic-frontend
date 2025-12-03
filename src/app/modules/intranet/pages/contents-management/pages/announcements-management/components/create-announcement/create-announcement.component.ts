
import { Component, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { AnnouncementInfo } from '../../../../../../../../services/landing/announcements/announcement.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { UploadOrReuseImageComponent } from '../../../../../shared/components/upload-or-reuse-image/upload-or-reuse-image.component';
import labels from './create-announcement.lang';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import {
  formatDate,
  formatDateByLang,
} from '../../../../../../../../helpers/date-formatters';
import { AppLanguage } from '../../../../../../../../services/shared/lang/lang.interfaces';

@Component({
  standalone: true,
  selector: 'app-create-announcement',
  templateUrl: './create-announcement.component.html',
  imports: [ReactiveFormsModule, UploadOrReuseImageComponent],
})
export class CreateAnnouncementComponent {
  public editMode: { paragraphIndex: number } | undefined = undefined;
  public paragraphs: string[] = [];
  public allImages: string[] = [];

  public selectedImageIndex: number = -1;

  @Output() public onPublish: EventEmitter<AnnouncementInfo> =
    new EventEmitter();

  public formGroup: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(300)]],
    paragraph: ['', []],
    issuedBy: ['', [Validators.required, Validators.maxLength(200)]],
    deadlineDate: ['', [Validators.required, this.dateInFuture]],
    imageName: ['', [Validators.required]],
  });

  public constructor(
    private formBuilder: FormBuilder,
    private langService: LangService,
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
      'announcements',
      this.formGroup.get('imageName')?.value,
    );
  }
  private dateInFuture(control: AbstractControl): ValidationErrors | null {
    const deadlineDate = new Date(control.value);
    if (deadlineDate < new Date()) {
      return { dateAfterNow: true };
    }
    return null;
  }

  public handleAddParagraph() {
    const paragraphText = this.formGroup.get('paragraph');
    if (!paragraphText?.value) {
      this.toastService.error(labels.emptyParagraphError[this.lang]);
      return;
    }
    if (this.editMode) {
      this.paragraphs[this.editMode.paragraphIndex] = paragraphText.value;
      this.editMode = undefined;
      paragraphText.setValue('');
      return;
    }
    this.paragraphs.push(paragraphText.value);
    paragraphText.setValue('');
  }

  public handleEditParagraph(i: number) {
    this.editMode = { paragraphIndex: i };
    this.formGroup.get('paragraph')?.setValue(this.paragraphs[i]);
  }

  public handleDeleteParagraph(indexToRemove: number) {
    this.paragraphs = this.paragraphs.filter(
      (_element, index) => index !== indexToRemove,
    );
  }

  public handleSubmit() {
    if (this.formGroup.invalid) {
      this.toastService.error(labels.formHasErrors[this.lang]);
      this.formGroup.markAllAsTouched();
      return;
    }

    const announcementInfo: AnnouncementInfo = {
      title: this.formGroup.get('title')?.value,
      paragraphs: this.paragraphs,
      issuedBy: this.formGroup.get('issuedBy')?.value,
      deadlineDate: new Date(this.formGroup.get('deadlineDate')?.value),
      imageName: this.formGroup.get('imageName')?.value,
    };

    this.onPublish.emit(announcementInfo);
  }

  public getCurrentDate(lang: AppLanguage): string {
    const offset = new Date().getTimezoneOffset();
    return formatDateByLang(
      new Date(new Date().getTime() + offset * 60 * 1000),
      lang,
    );
  }

  public handleSetAnnouncementImage(selectedImage: string) {
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
