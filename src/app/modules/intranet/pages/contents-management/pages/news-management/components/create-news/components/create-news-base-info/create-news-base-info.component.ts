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
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import {
  NewsBaseInfo,
  NewsCategory,
  NewsTag,
} from '../../../../../../../../../../services/landing/news/news.interfaces';
import { NewsService } from '../../../../../../../../../../services/landing/news/news.service';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../../../services/shared/resources/resource.service';
import { UploadOrReuseImageComponent } from '../../../../../../../shared/components/upload-or-reuse-image/upload-or-reuse-image.component';
import labels from './create-news-base-info.lang';

@Component({
  standalone: true,
  selector: 'app-create-news-base-info',
  templateUrl: './create-news-base-info.component.html',
  imports: [CommonModule, ReactiveFormsModule, UploadOrReuseImageComponent],
})
export class CreateNewsBaseInfoComponent implements OnInit, OnChanges {
  @Input() public baseInfo: NewsBaseInfo | null = null;
  @Output() public onSubmit: EventEmitter<NewsBaseInfo> = new EventEmitter();
  public editMode: { paragraphIndex: number } | undefined = undefined;
  public editTagMode: { tagIndex: number } | undefined = undefined;
  public editCategoryMode: { categoryIndex: number } | undefined = undefined;
  public editTagName = '';
  public editCategoryName = '';
  public newsCategories: NewsCategory[] = [];
  public newsTags: NewsTag[] = [];
  public selectedTags: NewsTag[] = [];
  public formGroup: FormGroup = new FormGroup({});

  public constructor(
    private formBuilder: FormBuilder,
    private newsService: NewsService,
    private toastService: ToastrService,
    private langService: LangService,
    private resourcesService: ResourcesService,
  ) {}

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
      selectedCategory: [this.baseInfo?.category.id, [Validators.required]],
      imageName: [this.baseInfo?.imageName, [Validators.required]],
      newCategory: ['', [Validators.maxLength(200)]],
      newTag: ['', [Validators.maxLength(200)]],
    });
  }

  public ngOnInit(): void {
    this.newsService.fetchCategories().subscribe((categories) => {
      this.newsCategories = categories.sort((a, b) => a.id - b.id);
    });
    this.newsService.fetchTags().subscribe((tags) => {
      this.newsTags = tags.sort((a, b) => a.id - b.id);
    });
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleAddNewCategory() {
    const category = this.formGroup.get('newCategory')?.value as string;

    return this.newsService.createCategory(category).subscribe({
      next: (category) => {
        const { id, name } = category;
        this.newsCategories = [...this.newsCategories, { id, name }];
        this.formGroup.get('selectedCategory')?.setValue(id + '');
        this.formGroup.get('newCategory')?.setValue('');
        this.toastService.success(
          `La categoría se usará automáticamente en la noticia que se está creando`,
          'Categoría creada exitosamente',
          { timeOut: 10000 },
        );
      },
      error: (err) => {
        this.toastService.error(
          `${
            err.status === 409
              ? 'El nombre de la categoría posiblemente ya ha sido tomado'
              : 'Intenta nuevamente o usa otro nombre'
          }`,
          'Error al crear la categoría',
          { timeOut: 10000 },
        );
      },
    });
  }

  public isTagSelected(id: number) {
    return this.selectedTags.some((tag) => tag.id === id);
  }

  public handleToggleTag(tag: NewsTag) {
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
    const tagAlreadyExists = this.newsTags.some(({ name }) => name === tagName);

    if (tagAlreadyExists) return;

    return this.newsService.createTag(tagName).subscribe({
      next: (tag) => {
        const { id, name } = tag;
        this.newsTags = [...this.newsTags, { id, name }];
        this.selectedTags = [...this.selectedTags, { id, name }];
        this.formGroup.get('newTag')?.setValue('');
        this.toastService.success(
          `La etiqueta se usará automáticamente en la noticia que se está creando`,
          'Etiqueta creada exitosamente',
          { timeOut: 10000 },
        );
      },
      error: (err) => {
        this.toastService.error(
          `${
            err.status === 409
              ? 'El nombre de la etiqueta posiblemente ya ha sido tomado'
              : 'Intenta nuevamente o usa otro nombre'
          }`,
          'Error al crear la etiqueta',
          { timeOut: 10000 },
        );
      },
    });
  }

  public handleDeleteSelectedTag(id: number) {
    this.selectedTags = this.selectedTags.filter((tag) => tag.id !== id);
  }

  public handleSetNewsImage(selectedImage: string) {
    this.formGroup.get('imageName')?.setValue(selectedImage);
  }

  public getCategoryNameById(id: string): string {
    return (
      this.newsCategories.find(({ id: categoryId }) => id === categoryId + '')
        ?.name || ''
    );
  }

  public async handleSubmit() {
    if (this.formGroup.invalid) {
      this.toastService.error('El formulario contiene campos inválidos');
      this.formGroup.markAllAsTouched();
      return;
    }
    const title = this.formGroup.get('title')?.value as string;
    const description = this.formGroup.get('description')?.value as string;
    const author = this.formGroup.get('author')?.value as string;

    const imageName = this.formGroup.get('imageName')?.value as string;
    const selectedCategory = parseInt(
      this.formGroup.get('selectedCategory')?.value as string,
    );

    let categoryId: number;
    if (selectedCategory) {
      categoryId = selectedCategory;
    } else {
      categoryId = parseInt(this.formGroup.get('selectedCategory')?.value);
    }
    const category = this.newsCategories.find(({ id }) => id === categoryId)!;
    this.onSubmit.emit({
      id: this.baseInfo?.id,
      title,
      description,
      author,
      date: new Date(),
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

  public handleChangeCategory(category: NewsCategory) {
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
    this.editTagName = this.newsTags[i].name;
    this.editTagMode = { tagIndex: i };
  }

  public handleEditCategory(i: number) {
    this.editCategoryName = this.newsCategories[i].name;
    this.editCategoryMode = { categoryIndex: i };
  }

  public handleCancelEditTag() {
    this.editTagMode = undefined;
  }

  public handleCancelEditCategory() {
    this.editCategoryMode = undefined;
  }

  public handleConfirmEditTag() {
    this.newsService
      .editTag({
        id: this.newsTags[this.editTagMode!.tagIndex].id,
        name: this.editTagName,
      })
      .subscribe({
        next: (value) => {
          this.toastService.success('La etiqueta se ha editado exitosamente');
          this.newsTags[this.editTagMode!.tagIndex].name = this.editTagName;
          this.editTagMode = undefined;
        },
        error: (err) => {
          this.toastService.error(
            'No se pudo editar la etiqueta. Intenta nuevamente',
          );
        },
      });
  }

  public getImageUrlByName(imageName: string) {
    return this.resourcesService.getImageUrlByName('news', imageName);
  }

  public handleConfirmEditCategory() {
    this.newsService
      .editCategory({
        id: this.newsCategories[this.editCategoryMode!.categoryIndex].id,
        name: this.editCategoryName,
      })
      .subscribe({
        next: (value) => {
          this.toastService.success('La categoría se ha editado exitosamente');
          this.newsCategories[this.editCategoryMode!.categoryIndex].name =
            this.editCategoryName;
          this.editCategoryMode = undefined;
        },
        error: (err) => {
          this.toastService.error(
            'No se pudo editar la categoría. Intenta nuevamente',
          );
        },
      });
  }
}
