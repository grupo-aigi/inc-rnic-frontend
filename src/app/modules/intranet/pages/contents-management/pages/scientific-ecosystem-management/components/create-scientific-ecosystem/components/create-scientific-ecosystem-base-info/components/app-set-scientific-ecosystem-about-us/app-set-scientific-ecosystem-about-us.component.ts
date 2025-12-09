import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { ScientificEcosystemDetailAboutUs } from '../../../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { LangService } from '../../../../../../../../../../../../services/shared/lang/lang.service';
import labels from './app-set-scientific-ecosystem-about-us.lang';

@Component({
  standalone: true,
  templateUrl: './app-set-scientific-ecosystem-about-us.component.html',
  selector: 'app-set-scientific-ecosystem-about-us',
  imports: [ReactiveFormsModule],
})
export class SetScientificEcosystemAboutUsComponent {
  @Output() public onSubmit: EventEmitter<ScientificEcosystemDetailAboutUs> =
    new EventEmitter();
  public editMode: { paragraphIndex: number } | undefined = undefined;
  public descriptionParagraphs: string[] = [];
  public specificObjectivesParagraphs: string[] = [];

  public formGroup: FormGroup =
    this.formBuilder.group<ScientificEcosystemDetailAboutUs>({
      TYPE: 'SCIENTIFIC_ECOSYSTEM__ABOUT_US',
      description: [],
      generalObjective: '',
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

  public handleAddDescriptionParagraph() {
    const paragraphText = this.formGroup.get('description');
    if (!paragraphText?.value) {
      this.toastService.error('Debe ingresar texto en el campo de párrafo');
      return;
    }
    if (this.editMode) {
      this.descriptionParagraphs[this.editMode.paragraphIndex] =
        paragraphText.value;
      this.editMode = undefined;
      paragraphText.setValue('');
      return;
    }
    this.descriptionParagraphs.push(paragraphText.value);
    paragraphText.setValue('');
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
      this.editMode = undefined;
      paragraphText.setValue('');
      return;
    }
    this.specificObjectivesParagraphs.push(paragraphText.value);
    paragraphText.setValue('');
  }

  public handleDeleteDescriptionParagraph(indexToRemove: number) {
    this.descriptionParagraphs = this.descriptionParagraphs.filter(
      (_element, index) => index !== indexToRemove,
    );
  }

  public handleEditDescriptionParagraph(i: number) {
    this.editMode = { paragraphIndex: i };
    this.formGroup.get('description')?.setValue(this.descriptionParagraphs[i]);
  }

  public handleDeleteSpecificObjectiveParagraph(indexToRemove: number) {
    this.specificObjectivesParagraphs =
      this.specificObjectivesParagraphs.filter(
        (_element, index) => index !== indexToRemove,
      );
  }

  public handleEditSpecificObjectiveParagraph(i: number) {
    this.editMode = { paragraphIndex: i };
    this.formGroup
      .get('specificObjectives')
      ?.setValue(this.specificObjectivesParagraphs[i]);
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
    this.descriptionParagraphs = [];
    this.formGroup.reset();
  }
}
