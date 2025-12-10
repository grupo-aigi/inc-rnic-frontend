import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ToastrService } from 'ngx-toastr';

import { ContentTarget } from '../../../../../../../../../../../../services/shared/contents/contents.interfaces';
import { LangService } from '../../../../../../../../../../../../services/shared/lang/lang.service';
import { ScientificEcosystemDetailProjects } from '../../../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import labels from './app-set-scientific-ecosystem-projects.lang';

@Component({
  standalone: true,
  selector: 'app-set-scientific-ecosystem-projects',
  templateUrl: './app-set-scientific-ecosystem-projects.component.html',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
})
export class SetScientificEcosystemProjectsComponent {
  @Input() public target!: ContentTarget;
  @Output() public onSubmit: EventEmitter<ScientificEcosystemDetailProjects> =
    new EventEmitter();

  public projects: ScientificEcosystemDetailProjects['projects'] = [];
  public editingIndex: number = -1;
  public currentObjective: string = '';

  public formGroup = this.formBuilder.group({
    name: ['', Validators.required],
    author: ['', Validators.required],
    objectives: this.formBuilder.array<string>([], Validators.required),
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

  public get objectives(): FormArray {
    return this.formGroup.get('objectives') as FormArray;
  }

  public handleAddObjective() {
    if (!this.currentObjective.trim()) {
      this.toastService.error('El objetivo no puede estar vacío');
      return;
    }
    this.objectives.push(
      this.formBuilder.control(this.currentObjective.trim()),
    );
    this.currentObjective = '';
  }

  public handleRemoveObjective(index: number) {
    this.objectives.removeAt(index);
  }

  public handleAddProject() {
    if (this.formGroup.invalid) {
      this.toastService.error('El formulario contiene campos inválidos');
      return;
    }
    if (this.objectives.length === 0) {
      this.toastService.error('Debe agregar al menos un objetivo');
      return;
    }

    const { author, name } = this.formGroup.value;
    const objectivesArray = this.objectives.value;

    if (this.editingIndex >= 0) {
      // Editar proyecto existente
      this.projects[this.editingIndex] = {
        author: author!,
        name: name!,
        objectives: objectivesArray,
      };
      this.toastService.success('Proyecto actualizado correctamente');
      this.editingIndex = -1;
    } else {
      // Agregar nuevo proyecto
      this.projects.push({
        author: author!,
        name: name!,
        objectives: objectivesArray,
      });
      this.toastService.success('Proyecto agregado correctamente');
    }

    this.formGroup.reset();
    this.objectives.clear();
  }

  public handleEditProject(index: number) {
    const project = this.projects[index];
    this.editingIndex = index;

    this.formGroup.patchValue({
      name: project.name,
      author: project.author,
    });

    this.objectives.clear();
    project.objectives.forEach((obj) => {
      this.objectives.push(this.formBuilder.control(obj));
    });

    this.toastService.info('Editando proyecto');
  }

  public handleDeleteProject(index: number) {
    if (confirm('¿Está seguro de eliminar este proyecto?')) {
      this.projects.splice(index, 1);
      this.toastService.success('Proyecto eliminado');

      if (this.editingIndex === index) {
        this.cancelEdit();
      }
    }
  }

  public cancelEdit() {
    this.editingIndex = -1;
    this.formGroup.reset();
    this.objectives.clear();
  }

  public handleSubmit() {
    if (this.projects.length === 0) {
      this.toastService.error('Debe agregar al menos un proyecto');
      return;
    }

    const resourceInfo: ScientificEcosystemDetailProjects = {
      TYPE: 'PROYECTOS',
      projects: this.projects,
      paragraphs: [],
      images: [],
      resources: [],
    };

    this.onSubmit.emit(resourceInfo);
    this.formGroup.reset();
    this.objectives.clear();
    this.projects = [];
    this.editingIndex = -1;
  }
}
