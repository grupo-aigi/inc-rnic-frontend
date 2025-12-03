
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { MemoryInfo } from '../../../../../../../../services/landing/memories/memories.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './create-memory.lang';

@Component({
  standalone: true,
  selector: 'app-create-memory',
  templateUrl: './create-memory.component.html',
  imports: [ReactiveFormsModule],
})
export class CreateMemoryComponent implements OnInit {
  @Output() public onSubmit: EventEmitter<MemoryInfo> = new EventEmitter();
  @Output() public onCancel: EventEmitter<void> = new EventEmitter();
  @Input() public memoryToEdit: MemoryInfo | undefined;
  public editMode: { paragraphIndex: number } | undefined = undefined;
  public paragraphs: string[] = [];

  public formGroup: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(300)]],
    youtubeLink: ['', [Validators.required, this.validYoutubeLink()]],
    paragraph: [''],
  });

  public constructor(
    private formBuilder: FormBuilder,
    private langService: LangService,
    private toastService: ToastrService,
  ) {}

  public ngOnInit(): void {
    if (!this.memoryToEdit) return;
    this.initFormValues();
  }

  private initFormValues() {
    this.paragraphs = this.memoryToEdit!.paragraphs;
    this.formGroup.get('title')?.patchValue(this.memoryToEdit!.title);
    this.formGroup
      .get('youtubeVideoId')
      ?.patchValue(this.memoryToEdit!.youtubeVideoId);
  }

  private validYoutubeLink(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Regular expression to match YouTube URLs
      const youtubeLinkRegex =
        /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
      return youtubeLinkRegex.test(control.value)
        ? null
        : { invalidYoutubeLink: true };
    };
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public handleSubmit() {
    if (this.formGroup.invalid) {
      this.toastService.error(labels.formHasInvalidFields[this.lang]);
      this.formGroup.markAllAsTouched();
      return;
    }

    const youtubeVideoId = this.formGroup
      .get('youtubeLink')
      ?.value.split('v=')[1];

    const memoryInfo: MemoryInfo = {
      id: this.memoryToEdit?.id,
      title: this.formGroup.get('title')?.value,
      youtubeVideoId,
      paragraphs: this.paragraphs,
    };

    this.onSubmit.emit(memoryInfo);
  }

  public handleCancelUpdate(event: MouseEvent) {
    event.preventDefault();
    this.onCancel.emit();
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

  public handleAddParagraph() {
    const paragraphText = this.formGroup.get('paragraph');
    if (!paragraphText?.value) {
      this.toastService.error('Debe ingresar texto en el campo de párrafo');
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

  public handleDeleteParagraph(indexToRemove: number) {
    this.paragraphs = this.paragraphs.filter(
      (_element, index) => index !== indexToRemove,
    );
  }

  public handleEditParagraph(i: number) {
    this.editMode = { paragraphIndex: i };
    this.formGroup.get('paragraph')?.setValue(this.paragraphs[i]);
  }
}
