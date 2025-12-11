import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { LangService } from '../../../../../../../../../../../../services/shared/lang/lang.service';
import labels from './app-set-scientific-ecosystem-specific-objectives.lang';
import { ToastrService } from 'ngx-toastr';
import {
  ScientificEcosystemDetailAboutUs,
  ScientificEcosystemDetailSpecificObjectives,
} from '../../../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';

@Component({
  standalone: true,
  templateUrl:
    './app-set-scientific-ecosystem-specific-objectives.component.html',
  imports: [ReactiveFormsModule],
  selector: 'app-set-scientific-ecosystem-specific-objectives',
})
export class SetScientificEcosystemSpecificObjectivesComponent {
  @Output()
  public onFormChange: EventEmitter<ScientificEcosystemDetailSpecificObjectives> =
    new EventEmitter();
  public editMode: { paragraphIndex: number } | undefined = undefined;
  public specificObjectivesParagraphs: string[] = [];

  public formGroup: FormGroup =
    this.formBuilder.group<ScientificEcosystemDetailSpecificObjectives>({
      TYPE: 'OBJ_ESPECIFICOS',
      specificObjectives: [],
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

  public handleAddSpecificObjectiveParagraph() {
    const paragraphText = this.formGroup.get('specificObjectives');
    if (!paragraphText?.value) {
      this.toastService.error('Debe ingresar texto en el campo de párrafo');
      return;
    }

    if (this.editMode) {
      this.specificObjectivesParagraphs[this.editMode.paragraphIndex] =
        paragraphText.value;
      this.onFormChange.emit({
        TYPE: 'OBJ_ESPECIFICOS',
        specificObjectives: this.specificObjectivesParagraphs,
      });
      this.editMode = undefined;
      paragraphText.setValue('');
      return;
    }
    this.specificObjectivesParagraphs.push(paragraphText.value);
    this.onFormChange.emit({
      TYPE: 'OBJ_ESPECIFICOS',
      specificObjectives: this.specificObjectivesParagraphs,
    });
    paragraphText.setValue('');
  }

  public handleDeleteSpecificObjectiveParagraph(indexToRemove: number) {
    this.specificObjectivesParagraphs =
      this.specificObjectivesParagraphs.filter(
        (_element, index) => index !== indexToRemove,
      );
    this.onFormChange.emit({
      TYPE: 'OBJ_ESPECIFICOS',
      specificObjectives: this.specificObjectivesParagraphs,
    });
  }

  public handleEditSpecificObjectiveParagraph(i: number) {
    this.editMode = { paragraphIndex: i };
    this.formGroup
      .get('specificObjectives')
      ?.setValue(this.specificObjectivesParagraphs[i]);
  }

  public handleReset() {
    this.formGroup.reset();
    this.specificObjectivesParagraphs = [];
    this.editMode = undefined;
    this.onFormChange.emit({
      TYPE: 'OBJ_ESPECIFICOS',
      specificObjectives: this.specificObjectivesParagraphs,
    });
  }
}
