import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import {
  ContentTarget,
  ResourceContent,
  ResourceContentType8,
} from '../../../../../../../services/shared/contents/contents.interfaces';
import { ResourcesService } from '../../../../../../../services/shared/resources/resource.service';
import labels from './preview-resource-content-type8.lang';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';

@Component({
  standalone: true,
  selector: 'app-preview-resource-content-type8',
  templateUrl: './preview-resource-content-type8.component.html',
  imports: [CommonModule, CarouselModule],
})
export class PreviewResourceContentType8Component implements OnChanges {
  @Input() public target!: ContentTarget;
  @Input() public resource!: ResourceContent;
  @Input() public isFirst!: boolean;
  @Input() public isLast!: boolean;
  @Output() public onMoveUp: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onMoveDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onDelete: EventEmitter<void> = new EventEmitter<void>();
  public resourceContent!: ResourceContentType8;
  public testimonialsSliderOptions: OwlOptions = {
    loop: true,
    nav: true,
    dots: false,
    autoplay: true,
    smartSpeed: 1000,
    autoplayHoverPause: true,
    navText: [
      "<i class='bx bx-chevron-left'></i>",
      "<i class='bx bx-chevron-right'></i>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 1,
      },
      768: {
        items: 1,
      },
      1200: {
        items: 1,
      },
    },
  };

  public constructor(
    private resourcesService: ResourcesService,
    public langService: LangService,
  ) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.resourceContent = this.resource as ResourceContentType8;
  }

  public ngOnInit(): void {}

  public moveUp() {
    this.onMoveUp.emit();
  }

  public moveDown() {
    this.onMoveDown.emit();
  }

  public getImageUrlByName(imageName: string) {
    return this.resourcesService.getImageUrlByName(this.target, imageName);
  }

  public handleDeleteResource(event: MouseEvent) {
    event.preventDefault();
    this.onDelete.emit();
  }
}
