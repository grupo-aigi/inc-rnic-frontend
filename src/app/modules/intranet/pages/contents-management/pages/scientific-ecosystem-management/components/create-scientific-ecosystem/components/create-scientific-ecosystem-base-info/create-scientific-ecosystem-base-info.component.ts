import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { ScientificEcosystemCreateService } from '../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem-create.service';
import { ScientificEcosystemBaseInfo } from '../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import labels from './create-scientific-ecosystem-base-info.lang';

@Component({
  standalone: true,
  selector: 'app-create-scientific-ecosystem-base-info',
  templateUrl: './create-scientific-ecosystem-base-info.component.html',
  imports: [ReactiveFormsModule, CommonModule],
})
export class CreateScientificEcosystemBaseInfoComponent implements OnInit {
  @Output()
  public onSubmit: EventEmitter<ScientificEcosystemBaseInfo> =
    new EventEmitter();
  public formGroup: FormGroup = new FormGroup({});

  public constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastrService,
    private langService: LangService,
    private scientificEcosystemCreateService: ScientificEcosystemCreateService,
  ) {}

  public ngOnInit(): void {
    const baseInfo = this.scientificEcosystemCreateService.createInfo?.baseInfo;
    console.log({ baseInfo });
    this.formGroup = this.formBuilder.group({
      title: [
        {
          value: baseInfo?.title || '',
          disabled: !!baseInfo,
        },
        [Validators.required, Validators.maxLength(200)],
      ],
    });
  }

  public get baseInfo() {
    return this.scientificEcosystemCreateService.createInfo?.baseInfo;
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public async handleSubmit() {
    console.log({ invalid: this.formGroup.invalid });
    if (this.formGroup.invalid) {
      this.toastService.error(labels.formHasErrors[this.lang]);
      this.formGroup.markAllAsTouched();
      return;
    }
    const scientificEcosystemCreateInfo: ScientificEcosystemBaseInfo = {
      title: this.formGroup.get('title')?.value,
    };
    this.onSubmit.emit(scientificEcosystemCreateInfo);
  }

  public isFieldInvalid(fieldName: string): any {
    return (
      this.formGroup.get(fieldName)?.errors &&
      this.formGroup.get(fieldName)?.touched
    );
  }
}
