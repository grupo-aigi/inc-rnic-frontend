import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import {
  ConvocationArchive,
  ConvocationBaseInfo,
  ConvocationCategory,
} from '../../../../../../../../../../services/landing/convocation/convocation.interfaces';
import { ConvocationService } from '../../../../../../../../../../services/landing/convocation/convocation.service';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../../../services/shared/resources/resource.service';
import { UploadOrReuseImageComponent } from '../../../../../../../shared/components/upload-or-reuse-image/upload-or-reuse-image.component';
import { ConvocationInputFilesComponent } from '../convocation-input-files/convocation-input-files.component';
import labels from './create-convocation-base-info.lang';

@Component({
  standalone: true,
  selector: 'app-create-convocation-base-info',
  templateUrl: './create-convocation-base-info.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    UploadOrReuseImageComponent,
    ConvocationInputFilesComponent,
  ],
})
export class CreateConvocationBaseInfoComponent implements OnInit, OnChanges {
  @Input() public baseInfo: ConvocationBaseInfo | undefined;
  @Output() public onSubmit: EventEmitter<ConvocationBaseInfo> =
    new EventEmitter();
  public editMode: { paragraphIndex: number } | undefined = undefined;
  public editCategoryMode: { categoryIndex: number } | undefined = undefined;
  public editCategoryName = '';
  public convocationCategories: ConvocationCategory[] = [];
  public formGroup: FormGroup = new FormGroup({});
  public files: ConvocationArchive[] = [];

  public constructor(
    private formBuilder: FormBuilder,
    private convocationService: ConvocationService,
    private resourcesService: ResourcesService,
    private toastService: ToastrService,
    private langService: LangService,
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    this.files = this.baseInfo?.files || [];
    this.formGroup = this.formBuilder.group({
      title: [
        this.baseInfo?.title || '',
        [Validators.required, Validators.maxLength(200)],
      ],
      description: [
        this.baseInfo?.description || '',
        [Validators.required, Validators.maxLength(500)],
      ],
      budget: [
        this.baseInfo?.budget || '',
        [Validators.required, Validators.min(0)],
      ],
      startDate: [
        this.setupDate(this.baseInfo?.startDate),
        [Validators.required, this.dateInFuture],
      ],
      endDate: [
        this.setupDate(this.baseInfo?.endDate),
        [Validators.required, this.dateInFuture, this.dateAfterStartDate],
      ],
      selectedCategory: [
        this.baseInfo?.category.id || '',
        [Validators.required],
      ],
      imageName: [this.baseInfo?.imageName || '', [Validators.required]],
      newCategory: ['', [Validators.maxLength(200)]],
      scope: [this.baseInfo?.scope || 'NATIONAL', [Validators.required]],
    });
  }

  private setupDate(startDate: Date | undefined): string {
    if (!startDate) {
      return '';
    }
    const date = new Date(startDate);
    return `${date.getFullYear()}-${
      date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
  }

  public ngOnInit(): void {
    this.convocationService.fetchCategories().subscribe((categories) => {
      this.convocationCategories = categories.sort((a, b) => a.id - b.id);
    });
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleUpdateConvocationFiles(files: ConvocationArchive[]) {
    this.files = files;
  }

  public handleAddNewCategory() {
    const category = this.formGroup.get('newCategory')?.value as string;

    return this.convocationService.createCategory(category).subscribe({
      next: (category) => {
        const { id, name } = category;
        this.convocationCategories = [
          ...this.convocationCategories,
          { id, name },
        ];
        this.formGroup.get('selectedCategory')?.setValue(id + '');
        this.formGroup.get('newCategory')?.setValue('');
        this.toastService.success(
          labels.categoryCreated.description[this.lang],
          labels.categoryCreated.title[this.lang],
        );
      },
      error: (err) => {
        this.toastService.error(labels.errorCreatingCategory[this.lang]);
      },
    });
  }

  private dateInFuture(control: AbstractControl): ValidationErrors | null {
    const date = new Date(control.value);
    if (date < new Date()) {
      return { dateInFuture: true };
    }
    return null;
  }

  public get imageUrl() {
    return this.resourcesService.getImageUrlByName(
      'convocations',
      this.formGroup.get('imageName')?.value,
    );
  }

  public handleSetConvocationImage(selectedImage: string) {
    this.formGroup.get('imageName')?.setValue(selectedImage);
  }

  private dateAfterStartDate(
    control: AbstractControl,
  ): ValidationErrors | null {
    const startDate = new Date(
      control.parent?.get('startDate')?.value as string,
    );
    if (!startDate) {
      return { missingStartingDate: true };
    }
    const endDate = new Date(control.value);
    if (endDate < startDate) {
      return { dateAfterStartDate: true };
    }
    return null;
  }

  public async handleSubmit() {
    if (this.formGroup.invalid) {
      this.toastService.error(labels.formHasErrors[this.lang]);
      this.formGroup.markAllAsTouched();
      return;
    }
    const title = this.formGroup.get('title')?.value as string;
    const description = this.formGroup.get('description')?.value as string;
    const budget = this.formGroup.get('budget')?.value as number;
    const startDate = new Date(
      this.formGroup.get('startDate')?.value as string,
    );
    const endDate = new Date(this.formGroup.get('endDate')?.value as string);
    const imageName = this.formGroup.get('imageName')?.value as string;
    const selectedCategory = parseInt(
      this.formGroup.get('selectedCategory')?.value as string,
    );
    const scope = this.formGroup.get('scope')?.value;

    let categoryId: number;
    if (selectedCategory) {
      categoryId = selectedCategory;
    } else {
      categoryId = parseInt(this.formGroup.get('selectedCategory')?.value);
    }
    const category = this.convocationCategories.find(
      ({ id }) => id === categoryId,
    )!;
    this.onSubmit.emit({
      id: this.baseInfo?.id,
      title,
      description,
      budget,
      startDate,
      scope,
      files: this.files,
      endDate,
      category,
      imageName,
    });
  }

  public isCategorySelected(id: number) {
    return this.formGroup.get('selectedCategory')?.value === id + '';
  }

  public isFieldInvalid(fieldName: string): any {
    return (
      this.formGroup.get(fieldName)?.errors &&
      this.formGroup.get(fieldName)?.touched
    );
  }

  public handleEditCategoryInput(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value as string;
    this.editCategoryName = value;
  }

  public handleEditCategory(i: number) {
    this.editCategoryName = this.convocationCategories[i].name;
    this.editCategoryMode = { categoryIndex: i };
  }

  public handleCancelEditCategory() {
    this.editCategoryMode = undefined;
  }

  public handleConfirmEditCategory() {
    this.convocationService
      .editCategory({
        id: this.convocationCategories[this.editCategoryMode!.categoryIndex].id,
        name: this.editCategoryName,
      })
      .subscribe({
        next: (value) => {
          this.toastService.success(
            labels.categoryUpdatedSuccessfully[this.lang],
          );
          this.convocationCategories[
            this.editCategoryMode!.categoryIndex
          ].name = this.editCategoryName;
          this.editCategoryMode = undefined;
        },
        error: (err) => {
          this.toastService.error(labels.errorUpdatingCategory[this.lang]);
        },
      });
  }
}
