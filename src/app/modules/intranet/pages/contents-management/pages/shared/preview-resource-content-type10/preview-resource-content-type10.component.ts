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
  ResourceContentType10,
} from '../../../../../../../services/shared/contents/contents.interfaces';
import { ResourcesService } from '../../../../../../../services/shared/resources/resource.service';
import labels from './preview-resource-content-type10.lang';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';

@Component({
  standalone: true,
  selector: 'app-preview-resource-content-type10',
  templateUrl: './preview-resource-content-type10.component.html',
  imports: [CommonModule, CarouselModule],
})
export class PreviewResourceContentType10Component implements OnChanges {
  @Input() public target!: ContentTarget;
  @Input() public resource!: ResourceContent;
  @Input() public isFirst!: boolean;
  @Input() public isLast!: boolean;
  @Output() public onMoveUp: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onMoveDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onDelete: EventEmitter<void> = new EventEmitter<void>();
  public resourceContent!: ResourceContentType10;
  public partnerSlidesOptions: OwlOptions = {
    loop: true,
    margin: 30,
    nav: false,
    dots: false,
    autoplay: true,
    smartSpeed: 1000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 2,
      },
      576: {
        items: 3,
      },
      768: {
        items: 4,
      },
      1200: {
        items: 5,
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
    this.resourceContent = this.resource as ResourceContentType10;
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
