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

import { ToastrService } from 'ngx-toastr';

import {
  ContentTarget,
  ResourceContentType12,
} from '../../../../../../../services/shared/contents/contents.interfaces';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';
import labels from './create-resource-content-type12.lang';

@Component({
  standalone: true,
  selector: 'app-create-resource-content-type12',
  templateUrl: './create-resource-content-type12.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class CreateResourceContentType12Component {
  @Input() public target!: ContentTarget;
  @Output() public onSubmit: EventEmitter<ResourceContentType12> =
    new EventEmitter();

  public formGroup: FormGroup = this.formBuilder.group({
    iframeLink: ['', [Validators.required, this.validateGoogleMapsLink]],
    detail: ['', [Validators.maxLength(1000)]],
  });

  private validateGoogleMapsLink(
    control: FormControl,
  ): ValidationErrors | null {
    const mapUrlPattern =
      /<iframe.*src="(https:\/\/www\.google\.com\/maps\/embed\?.*)".*>.*<\/iframe>/;
    const value = control.value as string;

    if (mapUrlPattern.test(value)) {
      return null;
    } else {
      return { invalidMapUrl: true };
    }
  }

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

  public isFieldInvalid(fieldName: string): any {
    return (
      this.formGroup.get(fieldName)?.errors &&
      this.formGroup.get(fieldName)?.touched
    );
  }

  public get linkFromIframe() {
    const iframeLink = this.formGroup.get('iframeLink')?.value as string;
    return iframeLink.match(
      /<iframe.*src="(https:\/\/www\.google\.com\/maps\/embed\?.*)".*>.*<\/iframe>/,
    )?.[1];
  }

  public handleSubmit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.toastService.error('El formulario contiene campos inválidos');
      return;
    }
    const latiAndLong = this.formGroup.get('latiAndLong')?.value as string;
    const detail = this.formGroup.get('detail')?.value as string;
    const iframeLink = this.formGroup.get('iframeLink')?.value as string;
    this.onSubmit.emit({
      mapLink: this.linkFromIframe || '',
      detail,
      TYPE: 'CONTENT__MAP',
    });
    this.formGroup.reset();
  }
}
