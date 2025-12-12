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
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { ScientificEcosystemCreateService } from '../../../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem-create.service';
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

  public paragraphs: string[] = [];
  public projects: any[] = [];
  public resourceFiles: any[] = [];
  public resourceImages: ImageResource[] = [];
  public pendingImage: { imageName: string; cols: number } | null = null;

  public formGroup: FormGroup = this.formBuilder.group({
    paragraphText: ['', [Validators.required, Validators.maxLength(200)]],
    projectName: ['', Validators.required],
    projectAuthor: ['', Validators.required],
    projectObjectives: this.formBuilder.array<string>([]),
  });

  public imageColumnsForm: FormGroup = this.formBuilder.group({
    columns: [12, [Validators.required, Validators.min(1), Validators.max(12)]],
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
      this.paragraphs = currentSection.paragraphs;
      this.projects = currentSection.projects;
      this.resourceFiles = currentSection.resources;
      this.resourceImages = currentSection.images;
    }
  }

  private listenFormChanges(): void {
    this.formGroup.valueChanges.subscribe(() => {
      this.emitChanges();
    });
  }

  private emitChanges(): void {
    this.onFormChange.emit({
      paragraphs: this.paragraphs,
      projects: this.projects,
      resources: this.resourceFiles,
      images: this.resourceImages,
    } as any);
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public get projectObjectives() {
    return this.formGroup.get('projectObjectives') as any;
  }

  public handleAddParagraph() {
    const paragraphText = this.formGroup.get('paragraphText');

    if (!paragraphText?.value?.trim()) {
      this.toastService.error('Debe ingresar texto en el campo de párrafo');
      return;
    }

    if (this.editingParagraphIndex >= 0) {
      this.paragraphs[this.editingParagraphIndex] = paragraphText.value.trim();
      this.toastService.success('Párrafo actualizado correctamente');
      this.editingParagraphIndex = -1;
    } else {
      this.paragraphs.push(paragraphText.value.trim());
      this.toastService.success('Párrafo agregado correctamente');
    }

    paragraphText.setValue('');
    this.emitChanges();
  }

  public handleEditParagraph(index: number) {
    this.editingParagraphIndex = index;
    this.formGroup.get('paragraphText')?.setValue(this.paragraphs[index]);
  }

  public handleDeleteParagraph(index: number) {
    if (confirm('¿Está seguro de eliminar este párrafo?')) {
      this.paragraphs.splice(index, 1);
      this.toastService.success('Párrafo eliminado');

      if (this.editingParagraphIndex === index) {
        this.cancelParagraphEdit();
      } else if (this.editingParagraphIndex > index) {
        this.editingParagraphIndex--;
      }
      this.emitChanges();
    }
  }

  public cancelParagraphEdit() {
    this.editingParagraphIndex = -1;
    this.formGroup.get('paragraphText')?.setValue('');
  }

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

    const projectData = {
      name: projectName.value,
      author: projectAuthor.value,
      objectives: this.projectObjectives.value,
    };

    if (this.editingProjectIndex >= 0) {
      this.projects[this.editingProjectIndex] = projectData;
      this.toastService.success('Proyecto actualizado correctamente');
      this.editingProjectIndex = -1;
    } else {
      this.projects.push(projectData);
      this.toastService.success('Proyecto agregado correctamente');
    }

    this.clearProjectForm();
    this.emitChanges();
  }

  public handleEditImageColumns(index: number, newCols: number) {
    if (newCols >= 1 && newCols <= 12) {
      this.resourceImages[index].cols = newCols;
      this.handleEmitChanges();
    }
  }

  public handleImageSelected(selectedImage: string) {
    this.pendingImage = {
      imageName: selectedImage,
      cols: this.imageColumnsForm.get('columns')?.value || 12,
    };
  }

  public handleConfirmImage() {
    if (!this.pendingImage) {
      this.toastService.error('Debe seleccionar una imagen primero');
      return;
    }

    this.resourceImages.push({
      imageName: this.pendingImage.imageName,
      cols: this.pendingImage.cols,
    });

    this.handleEmitChanges();
    this.pendingImage = null;
    this.imageColumnsForm.patchValue({ columns: 12 });
  }

  public handleEditProject(index: number) {
    const project = this.projects[index];
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

  private handleEmitChanges() {
    this.onFormChange.emit({
      TYPE: 'PROYECTOS',
      images: this.resourceImages,
      paragraphs: this.paragraphs,
      resources: this.resourceFiles,
      projects: this.projects,
    });
  }

  public handleDeleteProject(index: number) {
    if (confirm('¿Está seguro de eliminar este proyecto?')) {
      this.projects.splice(index, 1);
      this.toastService.success('Proyecto eliminado');

      if (this.editingProjectIndex === index) {
        this.cancelProjectEdit();
      } else if (this.editingProjectIndex > index) {
        this.editingProjectIndex--;
      }
      this.emitChanges();
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

          const fileData = {
            filename: value.filename,
            filetype: filetype,
            originalFilename: name,
            size: value.size,
          };

          this.resourceFiles.push(fileData);
          this.currUploadedFile = null;
          this.emitChanges();
        },
        error: () => {
          this.toastService.error(labels.errorUploadingFile[this.lang]);
        },
      });
  }

  public handleDeleteFile(index: number) {
    if (confirm('¿Está seguro de eliminar este archivo?')) {
      this.resourceFiles.splice(index, 1);
      this.toastService.success('Archivo eliminado');
      this.emitChanges();
    }
  }

  public getFileSize(bytes: number): string {
    if (bytes / 1000000000 > 1) return `${(bytes / 1000000000).toFixed(2)} GB`;
    if (bytes / 1000000 > 1) return `${(bytes / 1000000).toFixed(2)} MB`;
    if (bytes / 1000 > 1) return `${(bytes / 1000).toFixed(2)} KB`;
    return `${bytes} B`;
  }

  // public handleAddImage(selectedImage: string) {
  //   this.resourceImages.push(selectedImage);
  //   this.toastService.success('Imagen agregada correctamente');
  //   this.emitChanges();
  // }

  public handleDeleteImage(index: number) {
    if (confirm('¿Está seguro de eliminar esta imagen?')) {
      this.resourceImages.splice(index, 1);
      this.toastService.success('Imagen eliminada');
      this.emitChanges();
    }
  }

  public getImageUrlByName(imageName: string) {
    return this.resourcesService.getImageUrlByName(this.target, imageName);
  }

  public handleReset() {
    this.formGroup.reset();
    this.paragraphs = [];
    this.projects = [];
    this.projectObjectives.clear();
    this.resourceFiles = [];
    this.resourceImages = [];
    this.editingParagraphIndex = -1;
    this.editingProjectIndex = -1;
    this.currentObjective = '';
    this.currUploadedFile = null;
    this.toastService.info('Formulario reiniciado');
    this.emitChanges();
  }
}
