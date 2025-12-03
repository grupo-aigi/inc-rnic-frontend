
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';

import { ConvocationArchive } from '../../../../../../../../../../services/landing/convocation/convocation.interfaces';
import { ConvocationService } from '../../../../../../../../../../services/landing/convocation/convocation.service';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import {
  Filetypes,
  mimeTypes,
} from '../../../../../../../../../../services/shared/resources/resource.interfaces';
import { ResourcesService } from '../../../../../../../../../../services/shared/resources/resource.service';
import labels from './convocation-input-files.lang';

@Component({
  standalone: true,
  selector: 'app-convocation-input-files',
  templateUrl: './convocation-input-files.component.html',
  imports: [],
})
export class ConvocationInputFilesComponent {
  @Input() public convocationFiles!: ConvocationArchive[];

  @ViewChild('filetypeSelect')
  public filetypeSelect!: ElementRef<HTMLSelectElement>;

  @Output() public onChange: EventEmitter<ConvocationArchive[]> =
    new EventEmitter();
  public currUploadedFile: File | null = null;
  public currFiletype: Filetypes = 'PDF';

  public constructor(
    private langService: LangService,
    private resourcesService: ResourcesService,
    private convocationsService: ConvocationService,
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
    this.convocationFiles = this.convocationFiles.filter(
      (_element, i) => i !== index,
    );
    this.onChange.emit(this.convocationFiles);
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
    const { name, size } = this.currUploadedFile;
    this.resourcesService
      .createFile('convocations', this.currUploadedFile, name)
      .pipe(
        switchMap((value) =>
          this.convocationsService.createConvocationArchive(
            value.filename,
            name,
          ),
        ),
      )
      .subscribe({
        next: (value) => {
          this.toastrService.success(labels.fileHasBeenSaved[this.lang]);
          this.convocationFiles.push({
            id: value.id,
            filename: value.filename,
            name,
            createdAt: value.createdAt,
            updatedAt: value.updatedAt,
          });
          this.currUploadedFile = null;
          this.onChange.emit(this.convocationFiles);
          this.filetypeSelect.nativeElement.value = '';
        },
        error: (err) => {
          this.toastrService.error(labels.errorUploadingFile[this.lang]);
        },
      });
  }

  public getFileExtension(filename: string) {
    return filename.split('.').pop()?.toUpperCase();
  }
}
