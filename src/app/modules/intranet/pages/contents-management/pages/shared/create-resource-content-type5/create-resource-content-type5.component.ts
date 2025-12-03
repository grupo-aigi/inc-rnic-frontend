import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import {
  ContentTarget,
  ResourceContentType5,
} from '../../../../../../../services/shared/contents/contents.interfaces';
import { ResourcesService } from '../../../../../../../services/shared/resources/resource.service';
import { UploadOrReuseImageComponent } from '../../../../shared/components/upload-or-reuse-image/upload-or-reuse-image.component';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';
import labels from './create-resource-content-type5.lang';

@Component({
  standalone: true,
  selector: 'app-create-resource-content-type5',
  templateUrl: './create-resource-content-type5.component.html',
  imports: [ReactiveFormsModule, UploadOrReuseImageComponent],
})
export class CreateResourceContentType5Component {
  @Input() public target!: ContentTarget;
  @Output() public onSubmit: EventEmitter<ResourceContentType5> =
    new EventEmitter();
  public paragraphEditMode: { paragraphIndex: number } | undefined = undefined;
  public itemEditMode: { itemIndex: number } | undefined = undefined;
  public resourceImage: string | null = null;
  public paragraphs: string[] = [];
  public items: { title: string; content: string }[] = [];

  public formGroup: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    paragraph: [''],
    itemTitle: [''],
    itemContent: [''],
  });

  public constructor(
    private formBuilder: FormBuilder,
    private resourcesService: ResourcesService,
    private langService: LangService,
    private toastService: ToastrService,
  ) {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
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

  public handleDeleteParagraph(indexToRemove: number) {
    this.paragraphs = this.paragraphs.filter(
      (_element, index) => index !== indexToRemove,
    );
  }

  public handleEditItem(index: number) {
    this.itemEditMode = { itemIndex: index };
    this.formGroup.get('itemTitle')?.setValue(this.items[index].title);
    this.formGroup.get('itemContent')?.setValue(this.items[index].content);
  }

  public handleAddItem() {
    const itemTitle = this.formGroup.get('itemTitle');
    const itemContent = this.formGroup.get('itemContent');

    if (!itemTitle?.value || !itemContent?.value) {
      this.toastService.error(
        'Debe ingresar el título y el contenido del ítem desplegable',
      );
      return;
    }
    if (this.itemEditMode) {
      const updatedItem = {
        title: itemTitle.value,
        content: itemContent.value,
      };
      this.items[this.itemEditMode.itemIndex] = updatedItem;
      this.itemEditMode = undefined;
      itemTitle.setValue('');
      itemContent.setValue('');
      return;
    }

    this.items.push({
      title: itemTitle.value,
      content: itemContent.value,
    });
    itemTitle.setValue('');
    itemContent.setValue('');
  }

  public handleDeleteItem(indexToRemove: number) {
    this.items = this.items.filter(
      (_element, index) => index !== indexToRemove,
    );
  }

  public handleAddEventImage(selectedImage: string) {
    this.resourceImage = selectedImage;
  }

  public handleDeleteImage(index: number) {
    this.resourceImage = null;
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
      imageName: this.resourceImage as string,
      TYPE: 'CONTENT__TITLE_TOGGLE_ITEMS_AND_IMAGE',
    });
    this.formGroup.reset();
    this.resourceImage = null;
  }

  public getImageUrlByName(imageName: string) {
    return this.resourcesService.getImageUrlByName(this.target, imageName);
  }
}
