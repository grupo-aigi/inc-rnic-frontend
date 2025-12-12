import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { ScientificEcosystemDetailAboutUs } from '../../../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { LangService } from '../../../../../../../../../../../../services/shared/lang/lang.service';
import labels from './app-set-scientific-ecosystem-about-us.lang';
import { ScientificEcosystemCreateService } from '../../../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem-create.service';

@Component({
  standalone: true,
  templateUrl: './app-set-scientific-ecosystem-about-us.component.html',
  selector: 'app-set-scientific-ecosystem-about-us',
  imports: [ReactiveFormsModule],
})
export class SetScientificEcosystemAboutUsComponent implements OnInit {
  @Output()
  public onFormChange: EventEmitter<ScientificEcosystemDetailAboutUs> =
    new EventEmitter();
  public editMode: { paragraphIndex: number } | undefined = undefined;
  public descriptionParagraphs: string[] = [];

  public formGroup: FormGroup =
    this.formBuilder.group<ScientificEcosystemDetailAboutUs>({
      TYPE: 'NOSOTROS',
      description: [],
    });

  public constructor(
    private formBuilder: FormBuilder,
    private langService: LangService,
    private toastService: ToastrService,
    private scientificEcosystemCreateService: ScientificEcosystemCreateService,
  ) {}

  public ngOnInit(): void {
    this.loadExistingData();
  }

  private loadExistingData(): void {
    const createInfo = this.scientificEcosystemCreateService.createInfo;
    if (!createInfo?.detail.sections) return;

    const currentSection = createInfo.detail.sections.find(
      (section) => section.TYPE === 'NOSOTROS',
    ) as ScientificEcosystemDetailAboutUs | undefined;

    if (currentSection) {
      this.descriptionParagraphs = [...currentSection.description];
      this.formGroup.patchValue({
        TYPE: 'NOSOTROS',
        description: [],
      });
    }
  }

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
      this.scientificEcosystemCreateService.handleUpdateSection('NOSOTROS', {
        TYPE: 'NOSOTROS',
        description: this.descriptionParagraphs,
      });
      this.onFormChange.emit({
        TYPE: 'NOSOTROS',
        description: this.descriptionParagraphs,
      });
      return;
    }
    this.descriptionParagraphs.push(paragraphText.value);
    this.scientificEcosystemCreateService.handleUpdateSection('NOSOTROS', {
      TYPE: 'NOSOTROS',
      description: this.descriptionParagraphs,
    });
    this.onFormChange.emit({
      TYPE: 'NOSOTROS',
      description: this.descriptionParagraphs,
    });
    paragraphText.setValue('');
  }

  public handleDeleteDescriptionParagraph(indexToRemove: number) {
    this.descriptionParagraphs = this.descriptionParagraphs.filter(
      (_element, index) => index !== indexToRemove,
    );
    this.onFormChange.emit({
      TYPE: 'NOSOTROS',
      description: this.descriptionParagraphs,
    });
  }

  public handleEditDescriptionParagraph(i: number) {
    this.editMode = { paragraphIndex: i };
    this.formGroup.get('description')?.setValue(this.descriptionParagraphs[i]);
  }

  public handleReset() {
    this.formGroup.reset();
    this.descriptionParagraphs = [];
    this.editMode = undefined;
    this.onFormChange.emit({
      TYPE: 'NOSOTROS',
      description: this.descriptionParagraphs,
    });
  }
}
