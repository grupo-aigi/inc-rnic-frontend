import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { ScientificEcosystemDetailGeneralObjective } from '../../../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { LangService } from '../../../../../../../../../../../../services/shared/lang/lang.service';
import labels from './app-set-scientific-ecosystem-general-objective.lang';
import { ScientificEcosystemCreateService } from '../../../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem-create.service';

@Component({
  standalone: true,
  templateUrl:
    './app-set-scientific-ecosystem-general-objective.component.html',
  imports: [ReactiveFormsModule],
  selector: 'app-set-scientific-ecosystem-general-objective',
})
export class SetScientificEcosystemGeneralObjectiveComponent implements OnInit {
  @Output()
  public onFormChange: EventEmitter<ScientificEcosystemDetailGeneralObjective> =
    new EventEmitter();

  public formGroup: FormGroup =
    this.formBuilder.group<ScientificEcosystemDetailGeneralObjective>({
      TYPE: 'OBJ_GENERAL',
      generalObjective: '',
    });

  public constructor(
    private formBuilder: FormBuilder,
    private langService: LangService,
    private scientificEcosystemCreateService: ScientificEcosystemCreateService,
  ) {}

  public ngOnInit(): void {
    this.loadExistingData();
    this.listenFormChanges();
  }

  private loadExistingData(): void {
    const createInfo = this.scientificEcosystemCreateService.createInfo;
    if (!createInfo?.detail.sections) return;

    const currentSection = createInfo.detail.sections.find(
      (section) => section.TYPE === 'OBJ_GENERAL',
    ) as ScientificEcosystemDetailGeneralObjective | undefined;

    if (currentSection) {
      this.formGroup
        .get('generalObjective')
        ?.patchValue(currentSection.generalObjective);
    }
  }

  private listenFormChanges(): void {
    this.formGroup.valueChanges.subscribe((value) => {
      if (value.TYPE === null) {
        return this.onFormChange.emit({
          TYPE: 'OBJ_GENERAL',
          generalObjective: '',
        });
      }
      this.onFormChange.emit(value);
    });
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleReset() {
    this.formGroup.reset();
    this.onFormChange.emit({ TYPE: 'OBJ_GENERAL', generalObjective: '' });
  }
}
