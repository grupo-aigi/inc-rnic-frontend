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
  ResourceContentType10,
} from '../../../../../../../services/shared/contents/contents.interfaces';
import { ResourcesService } from '../../../../../../../services/shared/resources/resource.service';
import { UploadOrReuseImageComponent } from '../../../../shared/components/upload-or-reuse-image/upload-or-reuse-image.component';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';
import labels from './create-resource-content-type10.lang';

@Component({
  standalone: true,
  selector: 'app-create-resource-content-type10',
  templateUrl: './create-resource-content-type10.component.html',
  imports: [ReactiveFormsModule, UploadOrReuseImageComponent],
})
export class CreateResourceContentType10Component {
  @Input() public target!: ContentTarget;
  @Output() public onSubmit: EventEmitter<ResourceContentType10> =
    new EventEmitter();
  public selectedImageIndex: number = -1;
  public bannerItems: {
    url: string;
    image: string;
  }[] = [];

  public formGroup: FormGroup = this.formBuilder.group({
    url: ['', [Validators.required, Validators.pattern(/^(http|https):\/\//)]],
  });
  public currentImage: string | null = null;

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

  public handleAddBannerImage(selectedImage: string) {
    this.currentImage = selectedImage;
  }

  public handleDeleteBannerItem(index: number) {
    this.bannerItems.splice(index, 1);
  }

  public getImageUrlByName(imageName: string) {
    return this.resourcesService.getImageUrlByName(this.target, imageName);
  }

  public handleAddBannerItem() {
    if (this.formGroup.invalid) {
      this.toastService.error('El formulario contiene campos inválidos');
      return;
    }
    if (!this.currentImage) {
      this.toastService.error('Debe seleccionar una imagen');
      return;
    }
    const { url } = this.formGroup.value;
    this.bannerItems.push({ url, image: this.currentImage });
    this.formGroup.reset();
    this.currentImage = null;
  }

  public handleDeleteImage(index: number) {}

  public handleSubmit() {
    if (this.bannerItems.length === 0) {
      this.toastService.error(
        'Debe agregar al menos un elemento para el banner',
      );
      return;
    }
    const resourceInfo: ResourceContentType10 = {
      bannerItems: this.bannerItems,
      TYPE: 'CONTENT__DYNAMIC_BANNER',
    };
    this.onSubmit.emit(resourceInfo);
    this.formGroup.reset();
    this.bannerItems = [];
  }
}
