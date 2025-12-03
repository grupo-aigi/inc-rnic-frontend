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
  ResourceContentType6,
} from '../../../../../../../services/shared/contents/contents.interfaces';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';
import labels from './create-resource-content-type6.lang';

@Component({
  standalone: true,
  selector: 'app-create-resource-content-type6',
  templateUrl: './create-resource-content-type6.component.html',
  imports: [ReactiveFormsModule],
})
export class CreateResourceContentType6Component {
  @Input() public target!: ContentTarget;
  @Output() public onSubmit: EventEmitter<ResourceContentType6> =
    new EventEmitter();
  public paragraphEditMode: { paragraphIndex: number } | undefined = undefined;
  public itemEditMode: { itemIndex: number } | undefined = undefined;
  public paragraphs: string[] = [];
  public items: string[] = [];

  public formGroup: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    paragraph: [''],
    item: [''],
    listType: ['ordered'],
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

  public handleAddItem() {
    const itemText = this.formGroup.get('item');
    if (!itemText?.value) {
      this.toastService.error('Debe ingresar texto en el campo de ítem');
      return;
    }
    if (this.itemEditMode) {
      this.items[this.itemEditMode.itemIndex] = itemText.value;
      this.itemEditMode = undefined;
      itemText.setValue('');
      return;
    }
    this.items.push(itemText.value);
    itemText.setValue('');
  }

  public handleRemoveItem(i: number) {
    //
  }

  public handleEditParagraph(i: number) {
    this.paragraphEditMode = { paragraphIndex: i };
    this.formGroup.get('paragraph')?.setValue(this.paragraphs[i]);
  }

  public handleEditItem(i: number) {
    this.itemEditMode = { itemIndex: i };
    this.formGroup.get('item')?.setValue(this.items[i]);
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

  public handleSelectListType(type: 'ordered' | 'unordered') {
    this.formGroup.get('listType')?.setValue(type);
  }

  public handleSubmit() {
    if (this.formGroup.invalid) {
      this.toastService.error('El formulario contiene campos inválidos');
      return;
    }
    const title = this.formGroup.get('title')?.value;
    const listType = this.formGroup.get('listType')?.value;
    this.onSubmit.emit({
      title,
      paragraphs: this.paragraphs,
      items: this.items,
      listType,
      TYPE: 'CONTENT__TITLE_PARAGRAPHS_AND_SORTED_OR_UNSORTED_LIST',
    });
    this.formGroup.reset();

    this.paragraphs = [];
    this.items = [];
  }
}
