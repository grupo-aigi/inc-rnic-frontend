
import { Component, Input, OnInit } from '@angular/core';

import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import {
  ContentTarget,
  ResourceContentType8,
} from '../../../../../../services/shared/contents/contents.interfaces';
import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';

@Component({
  standalone: true,
  selector: 'app-resource-content-type8',
  templateUrl: './resource-content-type8.component.html',
  imports: [CarouselModule],
})
export class ResourceContentType8Component implements OnInit {
  @Input() public target!: ContentTarget;
  @Input({ alias: 'content', required: true }) public contentString!: string;
  public content!: ResourceContentType8;

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

  public constructor(private resourcesService: ResourcesService) {}

  public ngOnInit(): void {
    this.content = JSON.parse(this.contentString) as ResourceContentType8;
  }

  public getImageByName(name: string) {
    return this.resourcesService.getImageUrlByName(this.target, name);
  }
}
