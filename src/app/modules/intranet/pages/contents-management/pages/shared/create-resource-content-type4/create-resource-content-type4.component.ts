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
  ResourceContentType4,
} from '../../../../../../../services/shared/contents/contents.interfaces';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';
import labels from './create-resource-content-type4.lang';

@Component({
  standalone: true,
  selector: 'app-create-resource-content-type4',
  templateUrl: './create-resource-content-type4.component.html',
  imports: [ReactiveFormsModule],
})
export class CreateResourceContentType4Component {
  @Input() public target!: ContentTarget;
  @Output() public onSubmit: EventEmitter<ResourceContentType4> =
    new EventEmitter();
  public paragraphEditMode: { paragraphIndex: number } | undefined = undefined;
  public itemEditMode: { itemIndex: number } | undefined = undefined;
  public paragraphs: string[] = [];
  public items: string[] = [];

  public formGroup: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    paragraph: [''],
    item: ['', [Validators.maxLength(500)]],
  });

  public constructor(
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

  public handleEditParagraph(index: number) {
    this.paragraphEditMode = { paragraphIndex: index };
    this.formGroup.get('paragraph')?.setValue(this.paragraphs[index]);
  }

  public handleEditItem(index: number) {
    this.itemEditMode = { itemIndex: index };
    this.formGroup.get('item')?.setValue(this.items[index]);
  }

  public handleAddItem() {
    const item = this.formGroup.get('item');

    if (!item?.value) {
      this.toastService.error('Debe ingresar el contenido del ítem');
      return;
    }
    if (this.itemEditMode) {
      this.items[this.itemEditMode.itemIndex] = item.value as string;

      this.itemEditMode = undefined;
      item.setValue('');
      return;
    }

    this.items.push(item.value);
    item.setValue('');
  }

  public handleDeleteParagraph(indexToRemove: number) {
    this.paragraphs = this.paragraphs.filter(
      (_element, index) => index !== indexToRemove,
    );
  }

  public handleDeleteItem(indexToRemove: number) {
    this.items = this.items.filter(
      (_element, index) => index !== indexToRemove,
    );
  }

  public handleSubmit() {
    if (this.formGroup.invalid) {
      this.toastService.error('El formulario contiene campos inválidos');
      return;
    }
    const title = this.formGroup.get('title')?.value as string;
    this.onSubmit.emit({
      title,
      paragraphs: this.paragraphs,
      items: this.items,
      TYPE: 'CONTENT__TITLE_PARAGRAPHS_AND_LIST_ITEMS',
    });
    this.formGroup.reset();
    this.paragraphs = [];
    this.items = [];
  }
}
