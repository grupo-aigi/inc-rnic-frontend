import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { EventService } from '../../../../../../../../../../../../services/landing/event/event.service';
import { ScientificEcosystemDetailRoadmap } from '../../../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { ContentTarget } from '../../../../../../../../../../../../services/shared/contents/contents.interfaces';
import { LangService } from '../../../../../../../../../../../../services/shared/lang/lang.service';
import {
  Filetypes,
  mimeTypes,
} from '../../../../../../../../../../../../services/shared/resources/resource.interfaces';
import { ResourcesService } from '../../../../../../../../../../../../services/shared/resources/resource.service';
import labels from './app-set-scientific-ecosystem-roadmap.lang';

@Component({
  standalone: true,
  selector: 'app-set-scientific-ecosystem-roadmap',
  templateUrl: './app-set-scientific-ecosystem-roadmap.component.html',
  imports: [],
})
export class SetScientificEcosystemRoadmapComponent {
  @Input() public target!: ContentTarget;
  @Output() public onSubmit: EventEmitter<ScientificEcosystemDetailRoadmap> =
    new EventEmitter();
  @ViewChild('filetypeSelect')
  public filetypeSelect!: ElementRef<HTMLSelectElement>;
  public resourceFiles: {
    filename: string;
    filetype: Filetypes;
    originalFilename: string;
    size: number;
  }[] = [];

  public currUploadedFile: File | null = null;
  public currFiletype: Filetypes = 'PDF';

  public constructor(
    private formBuilder: FormBuilder,
    private langService: LangService,
    private eventsService: EventService,
    private resourcesService: ResourcesService,
    private toastrService: ToastrService,
  ) {}

  public onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const fileList: FileList | null = inputElement.files;

    if (!fileList) return;
    const file: File = fileList[0];

    const mimeType = mimeTypes.find(({ mimeTypes }) =>
      mimeTypes.includes(file.type),
    );
    if (!mimeType) {
      this.toastrService.error(
        'Por favor seleccione un tipo de archivo válido',
        'Error',
      );
      return;
    }
    const { filetype } = mimeType;
    if (filetype !== this.filetypeSelect.nativeElement.value) {
      this.toastrService.error(
        'Por favor seleccione un tipo de archivo válido',
        'Error',
      );
      return;
    }
    this.currUploadedFile = file;
  }

  public handleDeleteFile(index: number) {
    this.resourceFiles = this.resourceFiles.filter(
      (_element, i) => i !== index,
    );
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleAddFile(): void {
    const filetype = this.filetypeSelect.nativeElement.value as Filetypes;
    if (!filetype) {
      this.toastrService.error(labels.noFileSelected[this.lang]);
      return;
    }
    if (!this.currUploadedFile) {
      this.toastrService.error(labels.selectAFile[this.lang]);
      return;
    }
    const { name } = this.currUploadedFile;
    this.resourcesService
      .createFile('events', this.currUploadedFile, name)
      .subscribe({
        next: (value) => {
          this.toastrService.success(labels.fileHasBeenSaved[this.lang]);
          this.resourceFiles.push({
            filename: value.filename,
            filetype,
            originalFilename: name,
            size: value.size,
          });
          this.currUploadedFile = null;
        },
        error: (err) => {
          this.toastrService.error(labels.errorUploadingFile[this.lang]);
        },
      });
  }

  public getFileSize(bytes: number): string {
    if (bytes / 1000000000 > 1) return `${(bytes / 1000000000).toFixed(2)} GB`;
    if (bytes / 1000000 > 1) return `${(bytes / 1000000).toFixed(2)} MB`;
    if (bytes / 1000 > 1) return `${(bytes / 1000).toFixed(2)} KB`;
    return '';
  }

  public handleSubmit() {
    if (this.resourceFiles.length === 0) {
      this.toastrService.error(labels.addAtLeastOneFile[this.lang]);
      return;
    }
    const resourceInfo: ScientificEcosystemDetailRoadmap = {
      TYPE: 'LINEAMIENTOS',
      resources: this.resourceFiles,
      paragraphs: [],
      images: [],
    };

    this.onSubmit.emit(resourceInfo);
    this.resourceFiles = [];
    this.currUploadedFile = null;
  }
}
