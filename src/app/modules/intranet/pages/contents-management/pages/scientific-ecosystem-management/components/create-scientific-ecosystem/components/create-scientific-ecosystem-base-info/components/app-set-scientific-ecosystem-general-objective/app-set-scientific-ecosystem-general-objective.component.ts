import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { ScientificEcosystemDetailGeneralObjective } from '../../../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { LangService } from '../../../../../../../../../../../../services/shared/lang/lang.service';
import labels from './app-set-scientific-ecosystem-general-objective.lang';

@Component({
  standalone: true,
  templateUrl:
    './app-set-scientific-ecosystem-general-objective.component.html',
  imports: [ReactiveFormsModule],
  selector: 'app-set-scientific-ecosystem-general-objective',
})
export class SetScientificEcosystemGeneralObjectiveComponent {
  @Output()
  public onSubmit: EventEmitter<ScientificEcosystemDetailGeneralObjective> =
    new EventEmitter();
  public editMode: { paragraphIndex: number } | undefined = undefined;

  public formGroup: FormGroup =
    this.formBuilder.group<ScientificEcosystemDetailGeneralObjective>({
      TYPE: 'SCIENTIFIC_ECOSYSTEM__GENERAL_OBJECTIVE',
      generalObjective: '',
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
    const title = this.formGroup.get('title')?.value as string;

    this.onSubmit.emit({
      ...this.formGroup.value,
    });
    this.formGroup.reset();
  }
}
