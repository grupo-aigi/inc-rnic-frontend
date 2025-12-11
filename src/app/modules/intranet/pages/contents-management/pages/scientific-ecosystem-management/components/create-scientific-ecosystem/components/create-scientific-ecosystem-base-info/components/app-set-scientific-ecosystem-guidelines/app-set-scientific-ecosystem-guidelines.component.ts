import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { ScientificEcosystemDetailGuidelines } from '../../../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { ContentTarget } from '../../../../../../../../../../../../services/shared/contents/contents.interfaces';
import { LangService } from '../../../../../../../../../../../../services/shared/lang/lang.service';
import {
  Filetypes,
  mimeTypes,
} from '../../../../../../../../../../../../services/shared/resources/resource.interfaces';
import { ResourcesService } from '../../../../../../../../../../../../services/shared/resources/resource.service';
import { UploadOrReuseImageComponent } from '../../../../../../../../../shared/components/upload-or-reuse-image/upload-or-reuse-image.component';
import labels from './app-set-scientific-ecosystem-guidelines.lang';

@Component({
  standalone: true,
  templateUrl: './app-set-scientific-ecosystem-guidelines.component.html',
  imports: [ReactiveFormsModule, UploadOrReuseImageComponent],
  selector: 'app-set-scientific-ecosystem-guidelines',
})
export class SetScientificEcosystemGuidelinesComponent implements OnInit {
  @Input() public target!: ContentTarget;

  @Input() public baseInfo: ScientificEcosystemDetailGuidelines | null = null;

  @Output()
  public onFormChange: EventEmitter<ScientificEcosystemDetailGuidelines> =
    new EventEmitter();

  @ViewChild('filetypeSelect')
  public filetypeSelect!: ElementRef<HTMLSelectElement>;

  public paragraphs: string[] = [];
  public editMode: { paragraphIndex: number } | undefined = undefined;

  public resourceImages: string[] = [];
  public resourceFiles: {
    filename: string;
    filetype: Filetypes;
    originalFilename: string;
    size: number;
  }[] = [];

  public currUploadedFile: File | null = null;
  public currFiletype: Filetypes = 'PDF';

  public formGroup: FormGroup = this.formBuilder.group({
    paragraph: ['', [Validators.required, Validators.maxLength(200)]],
  });

  public constructor(
    private toastService: ToastrService,
    private formBuilder: FormBuilder,
    private langService: LangService,
    private resourcesService: ResourcesService,
    private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.listenFormChanges();
  }

  private listenFormChanges(): void {
    this.formGroup.valueChanges.subscribe((value) => {
      this.onFormChange.emit(value);
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['baseInfo'] && this.baseInfo) {
      this.formGroup.patchValue({
        paragraph: this.baseInfo.paragraphs?.[0] || '',
      });

      this.paragraphs = [...(this.baseInfo.paragraphs || [])];

      this.resourceFiles = [...(this.baseInfo.resources || [])];

      this.formGroup.get('paragraph')?.disable();
    }
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
        error: () => {
          this.toastrService.error(labels.errorUploadingFile[this.lang]);
        },
      });
  }

  public handleDeleteFile(index: number) {
    this.resourceFiles = this.resourceFiles.filter(
      (_element, i) => i !== index,
    );
  }

  public getFileSize(bytes: number): string {
    if (bytes / 1000000000 > 1) return `${(bytes / 1000000000).toFixed(2)} GB`;
    if (bytes / 1000000 > 1) return `${(bytes / 1000000).toFixed(2)} MB`;
    if (bytes / 1000 > 1) return `${(bytes / 1000).toFixed(2)} KB`;
    return `${bytes} B`;
  }

  public handleAddImage(selectedImage: string) {
    this.resourceImages.push(selectedImage);
  }

  public handleDeleteImage(index: number) {
    this.resourceImages = this.resourceImages.filter(
      (_element, i) => i !== index,
    );
  }

  public getImageUrlByName(imageName: string) {
    return this.resourcesService.getImageUrlByName(this.target, imageName);
  }

  public handleAddParagraph() {
    const paragraphText = this.formGroup.get('paragraph');
    if (!paragraphText?.value) {
      this.toastService.error('Debe ingresar texto en el campo de párrafo');
      return;
    }

    if (this.editMode) {
      this.paragraphs[this.editMode.paragraphIndex] = paragraphText.value;
      this.editMode = undefined;
      paragraphText.setValue('');
      return;
    }

    this.paragraphs.push(paragraphText.value);
    paragraphText.setValue('');
  }

  public handleEditParagraph(i: number) {
    this.editMode = { paragraphIndex: i };
    this.formGroup.get('paragraph')?.setValue(this.paragraphs[i]);
  }

  public handleDeleteParagraph(indexToRemove: number) {
    this.paragraphs = this.paragraphs.filter(
      (_element, index) => index !== indexToRemove,
    );
  }

  public handleReset() {
    this.resourceFiles = [];
    this.paragraphs = [];
    this.resourceImages = [];
    this.formGroup.enable();
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }
}
