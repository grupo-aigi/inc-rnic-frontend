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
  ResourceContentType14,
} from '../../../../../../../services/shared/contents/contents.interfaces';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';
import labels from './create-resource-content-type14.lang';

@Component({
  standalone: true,
  selector: 'app-create-resource-content-type14',
  templateUrl: './create-resource-content-type14.component.html',
  imports: [ReactiveFormsModule],
})
export class CreateResourceContentType14Component {
  @Input() public target!: ContentTarget;
  @Output() public onSubmit: EventEmitter<ResourceContentType14> =
    new EventEmitter();

  public formGroup: FormGroup = this.formBuilder.group({
    text: ['', [Validators.required]],
    url: ['', [Validators.required, Validators.pattern(/^(http|https):\/\//)]],
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

  public handleSubmit() {
    if (this.formGroup.invalid) {
      this.toastService.error('El formulario contiene campos inválidos');
      return;
    }
    const url = this.formGroup.get('url')?.value as string;
    const text = this.formGroup.get('text')?.value as string;
    this.onSubmit.emit({
      text,
      url,
      TYPE: 'CONTENT__LINK',
    });
    this.formGroup.reset();
  }
}
