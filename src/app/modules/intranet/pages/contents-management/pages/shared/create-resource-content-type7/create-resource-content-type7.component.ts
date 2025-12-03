import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import {
  ContentTarget,
  Quote,
  ResourceContentType7,
} from '../../../../../../../services/shared/contents/contents.interfaces';
import { ResourcesService } from '../../../../../../../services/shared/resources/resource.service';
import { UploadOrReuseImageComponent } from '../../../../shared/components/upload-or-reuse-image/upload-or-reuse-image.component';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';
import labels from './create-resource-content-type7.lang';

@Component({
  standalone: true,
  selector: 'app-create-resource-content-type7',
  templateUrl: './create-resource-content-type7.component.html',
  imports: [ReactiveFormsModule, UploadOrReuseImageComponent],
})
export class CreateResourceContentType7Component {
  @Input() public target!: ContentTarget;
  @Output() public onSubmit: EventEmitter<ResourceContentType7> =
    new EventEmitter();
  public paragraphEditMode: { paragraphIndex: number } | undefined = undefined;
  public quoteEditMode: { quoteIndex: number } | undefined = undefined;
  public paragraphs: string[] = [];
  public quotes: Quote[] = [];
  public currentImage: string | null = null;

  public formGroup: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    paragraph: [''],
    quoteContent: [''],
    quoteAuthor: [''],
    quoteRole: [''],
  });

  public constructor(
    private formBuilder: FormBuilder,
    private langService: LangService,
    private toastService: ToastrService,
    private resourcesService: ResourcesService,
  ) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleAddParagraph() {
    const paragraphText = this.formGroup.get('paragraph');
    if (!paragraphText?.value) {
      this.toastService.error('Debe ingresar texto en el campo de párrafo');
      return;
    }
    if (this.paragraphEditMode) {
      this.paragraphs[this.paragraphEditMode.paragraphIndex] =
        paragraphText.value;
      this.paragraphEditMode = undefined;
      paragraphText.setValue('');
      return;
    }
    this.paragraphs.push(paragraphText.value);
    paragraphText.setValue('');
  }

  public handleAddEventImage(selectedImage: string) {
    this.currentImage = selectedImage;
  }

  public handleEditParagraph(index: number) {
    this.paragraphEditMode = { paragraphIndex: index };
    this.formGroup.get('paragraph')?.setValue(this.paragraphs[index]);
  }

  public handleEditQuote(index: number) {
    this.quoteEditMode = { quoteIndex: index };

    this.formGroup.get('quoteContent')?.setValue(this.quotes[index].content);
    this.formGroup.get('quoteAuthor')?.setValue(this.quotes[index].author);
    this.formGroup.get('quoteRole')?.setValue(this.quotes[index].role);
  }

  public handleAddQuote() {
    const quoteContent = this.formGroup.get('quoteContent');
    const quoteAuthor = this.formGroup.get('quoteAuthor');
    const quoteRole = this.formGroup.get('quoteRole');

    if (!quoteRole?.value || !quoteAuthor?.value || !quoteContent?.value) {
      this.toastService.error('Debe ingresar todos los campos de la cita');
      return;
    }
    if (this.quoteEditMode) {
      const updatedQuote: Quote = {
        author: quoteAuthor?.value,
        role: quoteRole?.value,
        content: quoteContent?.value,
        imageName: this.currentImage || '',
      };
      this.quotes[this.quoteEditMode.quoteIndex] = updatedQuote;
      this.quoteEditMode = undefined;
      quoteContent.setValue('');
      quoteAuthor.setValue('');
      quoteRole.setValue('');
      this.currentImage = null;
      return;
    }

    this.quotes.push({
      imageName: this.currentImage || '',
      content: quoteContent?.value,
      author: quoteAuthor?.value,
      role: quoteRole?.value,
    });
    quoteContent.setValue('');
    quoteAuthor.setValue('');
    quoteRole.setValue('');
    this.currentImage = null;
  }

  public handleDeleteParagraph(indexToRemove: number) {
    this.paragraphs = this.paragraphs.filter(
      (_element, index) => index !== indexToRemove,
    );
  }

  public handleDeleteQuote(indexToRemove: number) {
    this.quotes = this.quotes.filter(
      (_element, index) => index !== indexToRemove,
    );
  }

  public getImageUrlByName(imageName: string) {
    return this.resourcesService.getImageUrlByName(this.target, imageName);
  }

  public handleSubmit() {
    if (this.formGroup.invalid) {
      this.toastService.error('El formulario contiene campos inválidos');
      return;
    }
    const title = this.formGroup.get('title')?.value;

    const resource: ResourceContentType7 = {
      title,
      paragraphs: this.paragraphs,
      quotes: this.quotes,
      TYPE: 'CONTENT__QUOTES_FEEDBACKS_OR_REFERENCES_1',
    };

    this.onSubmit.emit(resource);
    this.formGroup.reset();
    this.paragraphs = [];
    this.quotes = [];
    this.currentImage = null;
  }
}
