import { CommonModule, JsonPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
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

import {
  ScientificEcosystemBaseInfo,
  ScientificEcosystemDetail,
} from '../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { ScientificEcosystemService } from '../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.service';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../../../services/shared/resources/resource.service';
import labels from './create-scientific-ecosystem-base-info.lang';

@Component({
  standalone: true,
  selector: 'app-create-scientific-ecosystem-base-info',
  templateUrl: './create-scientific-ecosystem-base-info.component.html',
  imports: [ReactiveFormsModule, CommonModule, JsonPipe],
})
export class CreateScientificEcosystemBaseInfoComponent
  implements OnInit, OnChanges
{
  @Input() public baseInfo: ScientificEcosystemBaseInfo | undefined;

  @Output()
  public onSubmit: EventEmitter<ScientificEcosystemBaseInfo> =
    new EventEmitter();
  public formGroup: FormGroup = new FormGroup({});

  public constructor(
    private formBuilder: FormBuilder,
    private scientificEcosystemsService: ScientificEcosystemService,
    private resourcesService: ResourcesService,
    private toastService: ToastrService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    //   if (!this.scientificEcosystemToEdit) return;
    //   const { id, title, urlName } = this.scientificEcosystemToEdit;
    //   this.scientificEcosystemsService
    //     .fetchScientificEcosystemDetail(this.scientificEcosystemToEdit.urlName)
    //     .subscribe((response) => {
    //       this.baseInfo = { id, title };
    //       this.scientificEcosystemDetail = response;
    //     });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.formGroup = this.formBuilder.group({
      title: [
        {
          value: this.baseInfo?.title || '',
          disabled: !!this.baseInfo,
        },
        [Validators.required, Validators.maxLength(200)],
      ],
    });
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
