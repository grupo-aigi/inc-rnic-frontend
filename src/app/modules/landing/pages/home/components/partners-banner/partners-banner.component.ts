
import { Component } from '@angular/core';

import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './partners-banner.lang';
import { SupporterService } from '../../../../../../services/landing/supporters/supporters.service';
import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';
import { SupporterInfo } from '../../../../../../services/landing/supporters/supporters.interfaces';

@Component({
  standalone: true,
  selector: 'app-partners-banner',
  templateUrl: './partners-banner.component.html',
  imports: [CarouselModule],
})
export class PartnersBannerComponent {
  public supportersImages: string[] = [];
  public loadingSupporters: boolean = true;
  public supporters: SupporterInfo[] = [];
  public supportersSlidesOptions: OwlOptions = {
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
    private supporterService: SupporterService,
    private resourcesService: ResourcesService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.supporterService.fetchSupporters().subscribe((supporters) => {
      this.supporters = supporters.sort((a, b) => {
        return a.position! - b.position!;
      });
      this.loadingSupporters = false;
    });
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('supporters', name);
  }
}
