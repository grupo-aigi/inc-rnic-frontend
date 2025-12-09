import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { ScientificEcosystemDetailMembers } from '../../../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { ContentTarget } from '../../../../../../../../../../../../services/shared/contents/contents.interfaces';
import { LangService } from '../../../../../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../../../../../services/shared/resources/resource.service';
import { UploadOrReuseImageComponent } from '../../../../../../../../../shared/components/upload-or-reuse-image/upload-or-reuse-image.component';
import labels from './app-set-scientific-ecosystem-members.lang';

@Component({
  standalone: true,
  templateUrl: './app-set-scientific-ecosystem-members.component.html',
  imports: [ReactiveFormsModule, UploadOrReuseImageComponent],
  selector: 'app-set-scientific-ecosystem-members',
})
export class SetScientificEcosystemMembersComponent {
  @Input() public target!: ContentTarget;
  @Output() public onSubmit: EventEmitter<ScientificEcosystemDetailMembers> =
    new EventEmitter();
  public editMode: { paragraphIndex: number } | undefined = undefined;
  public paragraphs: string[] = [];
  public resourceImages: string[] = [];

  public formGroup: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    paragraph: [''],
  });

  public constructor(
    private formBuilder: FormBuilder,
    private langService: LangService,
    private resourcesService: ResourcesService,
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

  public handleAddEventImage(selectedImage: string) {
    this.resourceImages.push(selectedImage);
  }

  public handleDeleteImage(index: number) {
    this.resourceImages = this.resourceImages.filter(
      (_element, i) => i !== index,
    );
  }

  public handleSubmit() {
    if (this.formGroup.invalid) {
      this.toastService.error('El formulario contiene campos inválidos');
      return;
    }
    const title = this.formGroup.get('title')?.value as string;

    const resourceInfo: ScientificEcosystemDetailMembers = {
      title,
      paragraphs: this.paragraphs,
      images: this.resourceImages,
      TYPE: 'SCIENTIFIC_ECOSYSTEM__MEMBERS',
    };
    this.onSubmit.emit(resourceInfo);
    this.formGroup.reset();
  }

  public getImageUrlByName(imageName: string) {
    return this.resourcesService.getImageUrlByName(this.target, imageName);
  }
}
