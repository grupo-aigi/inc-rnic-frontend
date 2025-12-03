import { Component, OnInit } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { LangService } from '../../../../../../services/shared/lang/lang.service';

import { AnnouncementPoster } from '../../../../../../services/landing/announcements/announcement.interfaces';
import { AnnouncementService } from '../../../../../../services/landing/announcements/announcement.service';
import labels from './announcements.lang';

import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';

@Component({
  standalone: true,
  selector: 'app-announcements-intranet',
  templateUrl: './announcements.component.html',
  imports: [CarouselModule],
})
export class AnnouncementsComponent implements OnInit {
  public announcements: AnnouncementPoster[] = [];
  public activeAnnouncement: AnnouncementPoster | undefined;
  public loadingAnnouncements: boolean = true;
  public displayAnnouncements: boolean = true;

  public announcementsSliderOptions: OwlOptions = {
    loop: true,
    nav: false,
    dots: true,
    autoplay: true,
    smartSpeed: 500,
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
    private announcementService: AnnouncementService,
    private resourcesService: ResourcesService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.announcementService
      .getAnnouncements({ page: 0, size: 1000 })
      .then((announcements) => {
        announcements.forEach((announcement) => {
          this.announcements.push({
            ...announcement,
            deadlineDate: new Date(announcement.deadlineDate),
            createdAt: new Date(announcement.createdAt!),
          });
        });
      })
      .finally(() => {
        this.loadingAnnouncements = false;
      });
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('announcements', name);
  }

  public formatAnnouncementDate(timestamp: number): string {
    const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
    const parsedDate = new Date(
      timestamp + timezoneOffsetInMinutes * 60 * 1000,
    );
    const navigatorLanguage = window.navigator.language || 'en-US';
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    return parsedDate.toLocaleDateString(navigatorLanguage, options);
  }

  public setActiveAnnouncement(id: string) {
    this.activeAnnouncement = this.announcements.find(
      (announcement) => announcement.id === id,
    );
  }
}
