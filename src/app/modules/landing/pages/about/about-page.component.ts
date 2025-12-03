
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { Commissions } from '../../../../services/intranet/commissions/commissions.interfaces';
import { LangService } from '../../../../services/shared/lang/lang.service';
import labels from './about-page.lang';
import { CommissionDetailModalComponent } from './components/commission-detail-modal/commission-detail-modal.component';

@Component({
  standalone: true,
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  imports: [CarouselModule, CommissionDetailModalComponent],
})
export class AboutPage implements OnInit {
  public sliderOptions: OwlOptions = {
    items: 1,
    loop: true,
    nav: false,
    dots: true,
    autoplay: true,
    smartSpeed: 1000,
    autoplayHoverPause: true,
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

  public activeCommission: Commissions | null = null;
  @ViewChild('openClosePopup')
  public openClosePopup!: ElementRef<HTMLButtonElement>;

  public constructor(
    private title: Title,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public handleSetActiveCommission(commission: Commissions) {
    this.activeCommission = commission;
    this.openClosePopup.nativeElement.click();
  }
}
