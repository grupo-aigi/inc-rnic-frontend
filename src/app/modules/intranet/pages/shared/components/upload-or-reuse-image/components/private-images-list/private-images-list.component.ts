import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { ToastrModule } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';

import { ImageDirectory } from '../../../../../../../../services/shared/resources/resource.interfaces';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';

@Component({
  standalone: true,
  selector: 'app-private-images-list',
  templateUrl: './private-images-list.component.html',
  imports: [CommonModule, ToastrModule],
})
export class PrivateImagesListComponent implements OnChanges {
  @Input() public images: string[] = [];
  @Input() public elementType!: ImageDirectory;
  @Output() public onImageSelected: EventEmitter<number> = new EventEmitter();
  public selectedExistingImageIndex: number = -1;
  public imagesUrls: { image: string; url: string }[] = [];

  public constructor(private resourcesService: ResourcesService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['images']) {
      this.imagesUrls = this.images.map((image) => ({
        image,
        url: '',
      }));
      this.loadImages();
    }
  }

  private loadImages() {
    return Promise.all(
      this.images.map((image) => {
        return lastValueFrom(
          this.resourcesService.getUserAvatarImageByName(image),
        ).then((response) => {
          this.processImagesResponse(response, image);
        });
      }),
    );
  }

  public handleSelectExistingImage(index: number): void {
    this.selectedExistingImageIndex = index;
    this.onImageSelected.emit(index);
  }

  private processImagesResponse(response: Blob, imageName: string) {
    if (response.size === 0) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const browserUrl = reader.result as string;
      const currentImage = this.imagesUrls.find(
        (image) => image.image === imageName,
      );
      if (currentImage) {
        currentImage.url = browserUrl;
      }
    };
    reader.readAsDataURL(response);
  }
}
