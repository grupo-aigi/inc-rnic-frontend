
import { Component, Input, OnInit } from '@angular/core';

import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import {
  ContentTarget,
  ResourceContentType10,
} from '../../../../../../services/shared/contents/contents.interfaces';
import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';

@Component({
  standalone: true,
  selector: 'app-resource-content-type10',
  templateUrl: './resource-content-type10.component.html',
  imports: [CarouselModule],
})
export class ResourceContentType10Component implements OnInit {
  @Input() public target!: ContentTarget;
  @Input({ alias: 'content', required: true }) public contentString!: string;
  public content!: ResourceContentType10;
  public contentImages: { name: string; browserUrl: string }[] = [];
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

  public constructor(private resourcesService: ResourcesService) {}

  public ngOnInit(): void {
    this.content = JSON.parse(this.contentString) as ResourceContentType10;
  }

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName(this.target, name);
  }

  public getImageByName(name: string) {
    return this.contentImages.find((image) => image.name === name)?.browserUrl;
  }
}
