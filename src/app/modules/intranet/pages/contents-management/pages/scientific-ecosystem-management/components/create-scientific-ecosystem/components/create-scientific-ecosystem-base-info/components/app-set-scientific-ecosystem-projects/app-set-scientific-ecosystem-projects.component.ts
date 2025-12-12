import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { ScientificEcosystemDetailProjects } from '../../../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { ContentTarget } from '../../../../../../../../../../../../services/shared/contents/contents.interfaces';
import { LangService } from '../../../../../../../../../../../../services/shared/lang/lang.service';
import {
  Filetypes,
  mimeTypes,
} from '../../../../../../../../../../../../services/shared/resources/resource.interfaces';
import { ResourcesService } from '../../../../../../../../../../../../services/shared/resources/resource.service';
import { UploadOrReuseImageComponent } from '../../../../../../../../../shared/components/upload-or-reuse-image/upload-or-reuse-image.component';
import labels from './app-set-scientific-ecosystem-projects.lang';
import { ScientificEcosystemCreateService } from '../../../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem-create.service';

interface ImageResource {
  imageName: string;
  cols: number;
}

@Component({
  standalone: true,
  selector: 'app-set-scientific-ecosystem-projects',
  templateUrl: './app-set-scientific-ecosystem-projects.component.html',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    UploadOrReuseImageComponent,
  ],
})
export class SetScientificEcosystemProjectsComponent implements OnInit {
  @Input() public target!: ContentTarget;
  @Output()
  public onFormChange: EventEmitter<ScientificEcosystemDetailProjects> =
    new EventEmitter();

  @ViewChild('filetypeSelect')
  public filetypeSelect!: ElementRef<HTMLSelectElement>;

  public editingParagraphIndex: number = -1;
  public editingProjectIndex: number = -1;
  public currentObjective: string = '';
  public currUploadedFile: File | null = null;

  // FormGroup unificado
  public formGroup: FormGroup = this.formBuilder.group({
    // Sección de párrafos
    paragraphText: ['', [Validators.required, Validators.maxLength(200)]],
    paragraphs: this.formBuilder.array<string>([]),

    // Sección de proyectos
    projectName: ['', Validators.required],
    projectAuthor: ['', Validators.required],
    projectObjectives: this.formBuilder.array<string>([]),
    projects: this.formBuilder.array([]),

    // Sección de archivos
    resourceFiles: this.formBuilder.array([]),

    // Sección de imágenes
    resourceImages: this.formBuilder.array([]),
  });

  public constructor(
    private formBuilder: FormBuilder,
    private langService: LangService,
    private toastService: ToastrService,
    private resourcesService: ResourcesService,
    private scientificEcosystemCreateService: ScientificEcosystemCreateService,
  ) {}

  public ngOnInit(): void {
    this.listenFormChanges();
    this.loadExistingData();
  }

  private loadExistingData(): void {
    const createInfo = this.scientificEcosystemCreateService.createInfo;
    if (!createInfo?.detail.sections) return;

    const currentSection = createInfo.detail.sections.find(
      (section) => section.TYPE === 'PROYECTOS',
    ) as ScientificEcosystemDetailProjects | undefined;

    if (currentSection) {
      this.formGroup.get('paragraphs')?.patchValue(currentSection.paragraphs);
      this.formGroup.get('projects')?.patchValue(currentSection.projects);
      this.formGroup.get('resourceFiles')?.patchValue(currentSection.resources);
      this.formGroup.get('resourceImages')?.patchValue(currentSection.images);
    }
  }

  private listenFormChanges(): void {
    this.formGroup.valueChanges.subscribe((value) => {
      this.onFormChange.emit(value);
    });
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  // Getters para FormArrays
  public get paragraphs(): FormArray {
    return this.formGroup.get('paragraphs') as FormArray;
  }

  public get projectObjectives(): FormArray {
    return this.formGroup.get('projectObjectives') as FormArray;
  }

  public get projects(): FormArray {
    return this.formGroup.get('projects') as FormArray;
  }

  public get resourceFiles(): FormArray {
    return this.formGroup.get('resourceFiles') as FormArray;
  }

  public get resourceImages(): FormArray {
    return this.formGroup.get('resourceImages') as FormArray;
  }

  // ============ SECCIÓN DE PÁRRAFOS ============
  public handleAddParagraph() {
    const paragraphText = this.formGroup.get('paragraphText');

    if (!paragraphText?.value?.trim()) {
      this.toastService.error('Debe ingresar texto en el campo de párrafo');
      return;
    }

    if (this.editingParagraphIndex >= 0) {
      // Editar párrafo existente
      this.paragraphs
        .at(this.editingParagraphIndex)
        .setValue(paragraphText.value.trim());
      this.toastService.success('Párrafo actualizado correctamente');
      this.editingParagraphIndex = -1;
    } else {
      // Agregar nuevo párrafo
      this.paragraphs.push(
        this.formBuilder.control(paragraphText.value.trim()),
      );
      this.toastService.success('Párrafo agregado correctamente');
    }

    paragraphText.setValue('');
  }

  public handleEditParagraph(index: number) {
    this.editingParagraphIndex = index;
    this.formGroup
      .get('paragraphText')
      ?.setValue(this.paragraphs.at(index).value);
  }

  public handleDeleteParagraph(index: number) {
    if (confirm('¿Está seguro de eliminar este párrafo?')) {
      this.paragraphs.removeAt(index);
      this.toastService.success('Párrafo eliminado');

      if (this.editingParagraphIndex === index) {
        this.cancelParagraphEdit();
      } else if (this.editingParagraphIndex > index) {
        this.editingParagraphIndex--;
      }
    }
  }

  public cancelParagraphEdit() {
    this.editingParagraphIndex = -1;
    this.formGroup.get('paragraphText')?.setValue('');
  }

  // ============ SECCIÓN DE PROYECTOS ============
  public handleAddObjective() {
    if (!this.currentObjective.trim()) {
      this.toastService.error('El objetivo no puede estar vacío');
      return;
    }

    this.projectObjectives.push(
      this.formBuilder.control(this.currentObjective.trim()),
    );
    this.currentObjective = '';
  }

  public handleRemoveObjective(index: number) {
    this.projectObjectives.removeAt(index);
  }

  public handleAddProject() {
    const projectName = this.formGroup.get('projectName');
    const projectAuthor = this.formGroup.get('projectAuthor');

    if (!projectName?.value || !projectAuthor?.value) {
      this.toastService.error('Debe completar nombre y autor del proyecto');
      return;
    }

    if (this.projectObjectives.length === 0) {
      this.toastService.error('Debe agregar al menos un objetivo');
      return;
    }

    const projectData = this.formBuilder.group({
      name: [projectName.value],
      author: [projectAuthor.value],
      objectives: [this.projectObjectives.value],
    });

    if (this.editingProjectIndex >= 0) {
      // Editar proyecto existente
      this.projects.at(this.editingProjectIndex).patchValue({
        name: projectName.value,
        author: projectAuthor.value,
        objectives: this.projectObjectives.value,
      });
      this.toastService.success('Proyecto actualizado correctamente');
      this.editingProjectIndex = -1;
    } else {
      // Agregar nuevo proyecto
      this.projects.push(projectData);
      this.toastService.success('Proyecto agregado correctamente');
    }

    this.clearProjectForm();
  }

  public handleEditProject(index: number) {
    const project = this.projects.at(index).value;
    this.editingProjectIndex = index;

    this.formGroup.patchValue({
      projectName: project.name,
      projectAuthor: project.author,
    });

    this.projectObjectives.clear();
    project.objectives.forEach((obj: string) => {
      this.projectObjectives.push(this.formBuilder.control(obj));
    });

    this.toastService.info('Editando proyecto');
  }

  public handleDeleteProject(index: number) {
    if (confirm('¿Está seguro de eliminar este proyecto?')) {
      this.projects.removeAt(index);
      this.toastService.success('Proyecto eliminado');

      if (this.editingProjectIndex === index) {
        this.cancelProjectEdit();
      } else if (this.editingProjectIndex > index) {
        this.editingProjectIndex--;
      }
    }
  }

  public cancelProjectEdit() {
    this.editingProjectIndex = -1;
    this.clearProjectForm();
  }

  private clearProjectForm() {
    this.formGroup.patchValue({
      projectName: '',
      projectAuthor: '',
    });
    this.projectObjectives.clear();
    this.currentObjective = '';
  }

  // ============ SECCIÓN DE ARCHIVOS ============
  public onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const fileList: FileList | null = inputElement.files;
    if (!fileList) return;

    const file: File = fileList[0];
    const mimeType = mimeTypes.find(({ mimeTypes }) =>
      mimeTypes.includes(file.type),
    );

    if (!mimeType) {
      this.toastService.error(
        'Por favor seleccione un tipo de archivo válido',
        'Error',
      );
      return;
    }

    const { filetype } = mimeType;
    if (filetype !== this.filetypeSelect.nativeElement.value) {
      this.toastService.error(
        'Por favor seleccione un tipo de archivo válido',
        'Error',
      );
      return;
    }

    this.currUploadedFile = file;
  }

  public handleAddFile(): void {
    const filetype = this.filetypeSelect.nativeElement.value as Filetypes;

    if (!filetype) {
      this.toastService.error(labels.noFileSelected[this.lang]);
      return;
    }
    if (!this.currUploadedFile) {
      this.toastService.error(labels.selectAFile[this.lang]);
      return;
    }

    const { name } = this.currUploadedFile;

    this.resourcesService
      .createFile('ecosystems', this.currUploadedFile, name)
      .subscribe({
        next: (value) => {
          this.toastService.success(labels.fileHasBeenSaved[this.lang]);

          const fileData = this.formBuilder.group({
            filename: [value.filename],
            filetype: [filetype],
            originalFilename: [name],
            size: [value.size],
          });

          this.resourceFiles.push(fileData);
          this.currUploadedFile = null;
        },
        error: () => {
          this.toastService.error(labels.errorUploadingFile[this.lang]);
        },
      });
  }

  public handleDeleteFile(index: number) {
    if (confirm('¿Está seguro de eliminar este archivo?')) {
      this.resourceFiles.removeAt(index);
      this.toastService.success('Archivo eliminado');
    }
  }

  public getFileSize(bytes: number): string {
    if (bytes / 1000000000 > 1) return `${(bytes / 1000000000).toFixed(2)} GB`;
    if (bytes / 1000000 > 1) return `${(bytes / 1000000).toFixed(2)} MB`;
    if (bytes / 1000 > 1) return `${(bytes / 1000).toFixed(2)} KB`;
    return `${bytes} B`;
  }

  // ============ SECCIÓN DE IMÁGENES ============
  public handleAddImage(selectedImage: string) {
    this.resourceImages.push(this.formBuilder.control(selectedImage));
    this.toastService.success('Imagen agregada correctamente');
  }

  public handleDeleteImage(index: number) {
    if (confirm('¿Está seguro de eliminar esta imagen?')) {
      this.resourceImages.removeAt(index);
      this.toastService.success('Imagen eliminada');
    }
  }

  public getImageUrlByName(imageName: string) {
    return this.resourcesService.getImageUrlByName(this.target, imageName);
  }

  public handleReset() {
    this.formGroup.reset();
    this.paragraphs.clear();
    this.projects.clear();
    this.projectObjectives.clear();
    this.resourceFiles.clear();
    this.resourceImages.clear();
    this.editingParagraphIndex = -1;
    this.editingProjectIndex = -1;
    this.currentObjective = '';
    this.currUploadedFile = null;
    this.toastService.info('Formulario reiniciado');
  }
}
