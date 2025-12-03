import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import enLocale from '@fullcalendar/core/locales/en-au';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { formatDate } from '../../../../../../helpers/date-formatters';
import { EventPoster } from '../../../../../../services/landing/event/event.interfaces';
import { EventService } from '../../../../../../services/landing/event/event.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';
import labels from './main-events.lang';

@Component({
  standalone: true,
  selector: 'app-main-events',
  templateUrl: './main-events.component.html',
  imports: [CommonModule, CarouselModule, FullCalendarModule, RouterLink],
})
export class MainEventsComponent implements OnInit {
  public loadingPosters: boolean = true;
  public eventPosters: EventPoster[] = [];
  public teamSlidesOptions: OwlOptions = {
    loop: true,
    margin: 30,
    nav: false,
    dots: false,
    autoplay: true,
    smartSpeed: 1000,
    autoplayHoverPause: true,
    dotsData: true,
    navText: [
      "<i class='bx bx-chevron-left'></i>",
      "<i class='bx bx-chevron-right'></i>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 2,
      },
      768: {
        items: 2,
      },
      1200: {
        items: 3,
      },
    },
  };
  public eventImages: string[] = [];

  public calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    locale: this.langService.language,
    locales: [esLocale, enLocale],
  };

  public constructor(
    private langService: LangService,
    private eventService: EventService,
    private resourcesService: ResourcesService,
  ) {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public wordToHexColor(word: string) {
    // Calculate a simple hash code for the word
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = word.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert the hash code to a 24-bit hex color
    const color = (hash & 0x00ffffff).toString(16).toUpperCase();

    // Pad the color with zeros if it's less than 6 characters long
    return '#' + '0'.repeat(6 - color.length) + color;
  }

  private addDays(date: Date, days: number) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  public ngOnInit(): void {
    this.langService.language$.subscribe((lang) => {
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin],
        locale: lang,
      };
    });

    this.loadingPosters = true;
    this.eventService
      .fetchMostRecentEventPosters({ pagina: 0, cantidad: 10 })
      .then(({ records }) => {
        this.calendarOptions.events = records.map((eventPoster) => ({
          title: eventPoster.title,
          url: `/eventos/${eventPoster.urlName}`,
          start: this.addDays(eventPoster.startDate, 1),
          end: this.addDays(eventPoster.endDate, 2),
          allDay: true,
          backgroundColor: this.wordToHexColor(eventPoster.category.name),
          borderColor: this.wordToHexColor(eventPoster.category.name),
        }));
        this.eventPosters = records.sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        );
      })
      .finally(() => {
        this.loadingPosters = false;
      });
  }

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('events', name);
  }

  public formatEventDate(date: Date): string {
    return formatDate(date);
  }
}
