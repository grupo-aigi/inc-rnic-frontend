import { Component, Input } from '@angular/core';

import { ImageDirectory } from '../../../../../../services/shared/resources/resource.interfaces';
import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';
import { GridImage } from '../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';

@Component({
  standalone: true,
  selector: 'app-grid-images',
  templateUrl: './grid-images.component.html',
  imports: [],
})
export class GridImageComponent {
  @Input() images!: GridImage[];
  @Input() resourceDirectory!: ImageDirectory;

  public constructor(private resourcesService: ResourcesService) {}

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName(
      this.resourceDirectory,
      name,
    );
  }
}
