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
  EventBaseInfo,
  EventCategory,
  EventTag,
} from '../../../../../../../../../../services/landing/event/event.interfaces';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../../../services/shared/resources/resource.service';
import { EventService } from '../../../../../../../../../landing/../../services/landing/event/event.service';
import { UploadOrReuseImageComponent } from '../../../../../../../shared/components/upload-or-reuse-image/upload-or-reuse-image.component';
import labels from './create-event-base-info.lang';

@Component({
  standalone: true,
  selector: 'app-create-event-base-info',
  templateUrl: './create-event-base-info.component.html',
  imports: [ReactiveFormsModule, CommonModule, UploadOrReuseImageComponent],
})
export class CreateEventBaseInfoComponent implements OnInit, OnChanges {
  @Input() public baseInfo: EventBaseInfo | undefined;
  @Output() public onSubmit: EventEmitter<EventBaseInfo> = new EventEmitter();
  public editMode: { paragraphIndex: number } | undefined = undefined;
  public editTagMode: { tagIndex: number } | undefined = undefined;
  public editCategoryMode: { categoryIndex: number } | undefined = undefined;
  public editCategoryName = '';
  public editTagName = '';
  public eventCategories: EventCategory[] = [];
  public eventTags: EventTag[] = [];
  public selectedTags: EventTag[] = [];
  public formGroup: FormGroup = new FormGroup({});

  public constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private resourcesService: ResourcesService,
    private toastService: ToastrService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.eventService.fetchCategories().subscribe((categories) => {
      this.eventCategories = categories.sort((a, b) => a.id - b.id);
    });
    this.eventService.fetchTags().subscribe((tags) => {
      this.eventTags = tags.sort((a, b) => a.id - b.id);
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.selectedTags = this.baseInfo?.tags || [];
    this.formGroup = this.formBuilder.group({
      title: [
        this.baseInfo?.title || '',
        [Validators.required, Validators.maxLength(200)],
      ],
      description: [
        this.baseInfo?.description || '',
        [Validators.required, Validators.maxLength(500)],
      ],
      author: [
        this.baseInfo?.author || '',
        [Validators.required, Validators.maxLength(100)],
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
      newTag: ['', [Validators.maxLength(200)]],
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

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleAddNewCategory() {
    const category = this.formGroup.get('newCategory')?.value as string;

    return this.eventService.createCategory(category).subscribe({
      next: (category) => {
        const { id, name } = category;
        this.eventCategories = [...this.eventCategories, { id, name }];
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

  public isTagSelected(id: number) {
    return this.selectedTags.some((tag) => tag.id === id);
  }

  public handleToggleTag(tag: EventTag) {
    const isTagAdded = this.selectedTags.some(({ id }) => id === tag.id);
    if (isTagAdded) {
      this.selectedTags = this.selectedTags.filter(({ id }) => id !== tag.id);
    } else {
      this.selectedTags = [...this.selectedTags, tag];
    }
  }

  public handleAddNewTag() {
    const tag = this.formGroup.get('newTag')?.value as string;
    if (!tag.trim()) return;

    function capitalizeWords(name: string): string {
      const words = name.replace('  ', ' ').split(' ');

      const capitalizedWords = words.map((word) => {
        if (word.length === 0) {
          return '';
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      });

      return capitalizedWords.join('');
    }

    const tagName = capitalizeWords(tag);
    const tagAlreadyExists = this.eventTags.some(
      ({ name }) => name === tagName,
    );

    if (tagAlreadyExists) return;

    return this.eventService.createTag(tagName).subscribe({
      next: (tag) => {
        const { id, name } = tag;
        this.eventTags = [...this.eventTags, { id, name }];
        this.selectedTags = [...this.selectedTags, { id, name }];
        this.formGroup.get('newTag')?.setValue('');
        this.toastService.success(
          labels.tagCreated.description[this.lang],
          labels.tagCreated.title[this.lang],
        );
      },
      error: (err) => {
        this.toastService.error(labels.errorCreatingTag[this.lang]);
      },
    });
  }

  public handleDeleteSelectedTag(id: number) {
    this.selectedTags = this.selectedTags.filter((tag) => tag.id !== id);
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
      'events',
      this.formGroup.get('imageName')?.value,
    );
  }

  public handleSetEventImage(selectedImage: string) {
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
    const author = this.formGroup.get('author')?.value as string;
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
    const category = this.eventCategories.find(({ id }) => id === categoryId)!;
    this.onSubmit.emit({
      id: this.baseInfo?.id,
      title,
      description,
      author,
      startDate,
      scope,
      endDate,
      category,
      tags: this.selectedTags,
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

  public handleChangeScope(scope: 'NATIONAL' | 'INTERNATIONAL') {
    this.formGroup.get('scope')?.setValue(scope);
  }

  public handleChangeCategory(category: EventCategory) {
    this.formGroup.get('selectedCategory')?.setValue(category.id + '');
  }

  public handleChangeDate(fieldName: string, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const date = inputElement.value as string;
    this.formGroup.get(fieldName)?.setValue(date);
    this.formGroup.get(fieldName)?.markAsTouched();
  }

  public handleEditTagInput(event: KeyboardEvent) {
    // Get the value of the input field
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value as string;
    this.editTagName = value;
  }

  public handleEditCategoryInput(event: KeyboardEvent) {
    // Get the value of the input field
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value as string;
    this.editCategoryName = value;
  }

  public handleEditTag(i: number) {
    this.editTagName = this.eventTags[i].name;
    this.editTagMode = { tagIndex: i };
  }

  public handleEditCategory(i: number) {
    this.editCategoryName = this.eventCategories[i].name;
    this.editCategoryMode = { categoryIndex: i };
  }

  public handleCancelEditTag() {
    this.editTagMode = undefined;
  }

  public handleCancelEditCategory() {
    this.editCategoryMode = undefined;
  }

  public handleConfirmEditTag() {
    this.eventService
      .editTag({
        id: this.eventTags[this.editTagMode!.tagIndex].id,
        name: this.editTagName,
      })
      .subscribe({
        next: (value) => {
          this.toastService.success(labels.tagUpdatedSuccessfully[this.lang]);
          this.eventTags[this.editTagMode!.tagIndex].name = this.editTagName;
          this.editTagMode = undefined;
        },
        error: (err) => {
          this.toastService.error(labels.errorUpdatingTag[this.lang]);
        },
      });
  }

  public handleConfirmEditCategory() {
    this.eventService
      .editCategory({
        id: this.eventCategories[this.editCategoryMode!.categoryIndex].id,
        name: this.editCategoryName,
      })
      .subscribe({
        next: (value) => {
          this.toastService.success(
            labels.categoryUpdatedSuccessfully[this.lang],
          );
          this.eventCategories[this.editCategoryMode!.categoryIndex].name =
            this.editCategoryName;
          this.editCategoryMode = undefined;
        },
        error: (err) => {
          this.toastService.error(labels.errorUpdatingCategory[this.lang]);
        },
      });
  }
}
