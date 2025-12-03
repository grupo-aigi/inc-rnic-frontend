import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';
import {
  ContentTarget,
  ResourceContentType11,
} from '../../../../../../../services/shared/contents/contents.interfaces';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';
import labels from './create-resource-content-type11.lang';

@Component({
  standalone: true,
  selector: 'app-create-resource-content-type11',
  templateUrl: './create-resource-content-type11.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class CreateResourceContentType11Component {
  @Input() public target!: ContentTarget;
  @Output() public onSubmit: EventEmitter<ResourceContentType11> =
    new EventEmitter();
  public editMode: { paragraphIndex: number } | null = null;
  public paragraphs: string[] = [];

  public formGroup: FormGroup = this.formBuilder.group({
    youtubeLink: ['', [Validators.required, this.validateYoutubeUrl]],
    title: ['', [Validators.maxLength(500)]],
    paragraph: ['', [Validators.maxLength(1000)]],
    source: ['', [Validators.maxLength(400)]],
  });

  public constructor(
    public sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private langService: LangService,
    private toastService: ToastrService,
  ) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  private validateYoutubeUrl(control: FormControl): ValidationErrors | null {
    const url = control.value;
    if (url) {
      const youtubeUrlPattern =
        /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
      return youtubeUrlPattern.test(url) ? null : { invalidUrl: true };
    }
    return null;
  }

  public get safeYoutubeLink(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustUrl(
      this.formGroup.get('youtubeLink')!.value,
    );
  }

  public handleAddParagraph() {
    const paragraphText = this.formGroup.get('paragraph');
    if (!paragraphText?.value) {
      this.toastService.error('Debe ingresar texto en el campo de párrafo');
      return;
    }
    if (this.editMode) {
      this.paragraphs[this.editMode.paragraphIndex] = paragraphText.value;
      this.editMode = null;
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

  public isFieldInvalid(fieldName: string): any {
    return (
      this.formGroup.get(fieldName)?.errors &&
      this.formGroup.get(fieldName)?.touched
    );
  }

  public handleSubmit() {
    if (this.formGroup.invalid) {
      this.toastService.error('El formulario contiene campos inválidos');
      this.formGroup.markAllAsTouched();
      return;
    }
    const youtubeLink = this.formGroup.get('youtubeLink')?.value || '';
    const title = this.formGroup.get('title')?.value || '';
    const source = this.formGroup.get('source')?.value || '';
    this.onSubmit.emit({
      youtubeLink,
      title,
      paragraphs: this.paragraphs,
      source,
      TYPE: 'CONTENT__VIDEO_AND_REFERENCES',
    });
    this.formGroup.reset();
  }
}
