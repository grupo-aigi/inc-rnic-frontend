import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { ToastrModule, ToastrService } from 'ngx-toastr';

import { ImageDirectory } from '../../../../../../services/shared/resources/resource.interfaces';
import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';
import { PrivateImagesListComponent } from './components/private-images-list/private-images-list.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-upload-or-reuse-image',
  templateUrl: './upload-or-reuse-image.component.html',
  imports: [CommonModule, ToastrModule, PrivateImagesListComponent],
})
export class UploadOrReuseImageComponent implements OnInit {
  @Input() public elementType!: ImageDirectory;
  @Input() public modalFor!: string;
  @Input() public privateImages = false;
  @Output() public onSubmit: EventEmitter<string> = new EventEmitter();

  @ViewChild('closeButton') public closeButton!: ElementRef<HTMLButtonElement>;

  public uploadedImage: File | null = null;
  public uploadedImageBrowserUrl: ArrayBuffer | string | null = null;
  public selectedExistingImageBrowserUrl: string = '';

  public selectedExistingImageIndex: number = -1;
  public allImages: string[] = [];
  public noMoreImagesFound: boolean = false;

  public constructor(
    private resourcesService: ResourcesService,
    private toastService: ToastrService,
  ) {}

  public ngOnInit(): void {
    this.uploadedImage = null;
    this.selectedExistingImageBrowserUrl = '';
    this.selectedExistingImageIndex = -1;
    this.resourcesService
      .getAllImageNames(this.elementType, { skip: 0, limit: 10 })
      .subscribe({
        next: (images: string[]) => {
          this.allImages = images;
        },
        error: (err) => {
          console.error(`ha ocurrido un error: ${err}`);
        },
      });
  }

  public handleSelectExistingImage(index: number) {
    this.selectedExistingImageBrowserUrl = this.allImages[index];
    this.selectedExistingImageIndex = index;
    this.uploadedImage = null;
  }

  public handleLoadMoreImages() {
    this.resourcesService
      .getAllImageNames(this.elementType, {
        skip: this.allImages.length,
        limit: 10,
      })
      .subscribe((images) => {
        if (images.length === 0) {
          this.noMoreImagesFound = true;
          return;
        }
        this.allImages.push(...images);
      });
  }

  public onImageFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const fileList: FileList | null = inputElement.files;
    const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!fileList) return;

    const file: File = fileList[0];
    if (!allowedFormats.includes(file.type)) {
      this.toastService.error('Formato de imagen no soportado');
      return;
    }
    this.uploadedImage = file;
    this.convertFileToArrayBuffer(this.uploadedImage);
    this.selectedExistingImageBrowserUrl = '';
    this.selectedExistingImageIndex = -1;
  }

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName(this.elementType, name);
  }

  public convertFileToArrayBuffer(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const uploadedImageUrl = reader.result as string;
      this.uploadedImageBrowserUrl = uploadedImageUrl;
    };
    reader.readAsDataURL(file);
  }

  public handleSubmit() {
    if (this.uploadedImage) {
      this.resourcesService
        .createImage(this.elementType, this.uploadedImage)
        .subscribe(({ filename }) => {
          this.onSubmit.emit(filename);
          this.closeButton.nativeElement.click();
        });
    }
    if (!this.selectedExistingImageBrowserUrl) {
      return;
    }
    this.onSubmit.emit(this.selectedExistingImageBrowserUrl);
    this.closeButton.nativeElement.click();
  }
}
