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
  ResourceContentType9,
} from '../../../../../../../services/shared/contents/contents.interfaces';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';
import labels from './create-resource-content-type9.lang';

@Component({
  standalone: true,
  selector: 'app-create-resource-content-type9',
  templateUrl: './create-resource-content-type9.component.html',
  imports: [ReactiveFormsModule],
})
export class CreateResourceContentType9Component {
  @Input() public target!: ContentTarget;
  @Output() public onSubmit: EventEmitter<ResourceContentType9> =
    new EventEmitter();
  public editMode: { paragraphIndex: number } | undefined = undefined;
  public paragraphs: string[] = [];

  public formGroup: FormGroup = this.formBuilder.group({
    quote: ['', [Validators.required]],
    author: ['', [Validators.required]],
    role: ['', [Validators.required]],
  });

  public constructor(
    private formBuilder: FormBuilder,
    private langService: LangService,
    private toastService: ToastrService,
  ) {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public handleSubmit() {
    if (this.formGroup.invalid) {
      this.toastService.error('El formulario contiene campos inválidos');
      return;
    }
    const value = this.formGroup.value as ResourceContentType9;
    this.onSubmit.emit({ ...value, TYPE: 'CONTENT__QUOTE_AND_AUTHOR' });
    this.formGroup.reset();
  }
}
