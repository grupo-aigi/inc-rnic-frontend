import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { SupporterInfo } from '../../../../../../../../services/landing/supporters/supporters.interfaces';
import { SupporterService } from '../../../../../../../../services/landing/supporters/supporters.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { UploadOrReuseImageComponent } from '../../../../../shared/components/upload-or-reuse-image/upload-or-reuse-image.component';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import labels from './create-supporter.lang';

@Component({
  standalone: true,
  selector: 'app-create-supporter',
  templateUrl: './create-supporter.component.html',
  imports: [ReactiveFormsModule, UploadOrReuseImageComponent],
})
export class CreateSupporterComponent {
  @Output() public onCreate: EventEmitter<SupporterInfo> = new EventEmitter();

  public formGroup: FormGroup = this.formBuilder.group({
    url: [
      '',
      [
        Validators.required,
        Validators.maxLength(300),
        Validators.pattern('https://.+'),
      ],
    ],
    imageName: ['', [Validators.required]],
  });

  public constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastrService,
    private langService: LangService,
    private supporterService: SupporterService,
    private resourcesService: ResourcesService,
  ) {}

  public get imageUrl() {
    return this.resourcesService.getImageUrlByName(
      'supporters',
      this.formGroup.get('imageName')?.value,
    );
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleSubmit() {
    if (this.formGroup.invalid) {
      this.toastService.error('El formulario contiene campos inválidos');
      this.formGroup.markAllAsTouched();
      return;
    }
    const supporterInfo: SupporterInfo = {
      url: this.formGroup.get('url')?.value,
      imageName: this.formGroup.get('imageName')?.value,
    };
    this.onCreate.emit(supporterInfo);
    this.formGroup.reset();
  }

  public handleSetSupporterImage(selectedImage: string) {
    this.formGroup.get('imageName')?.setValue(selectedImage);
  }

  public isFieldInvalid(fieldName: string): boolean | null | undefined {
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
