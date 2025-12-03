import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';

import { formatDate } from '../../../../helpers/date-formatters';
import {
  EventFilterCriteria,
  EventPoster,
} from '../../../../services/landing/event/event.interfaces';
import { EventService } from '../../../../services/landing/event/event.service';
import { LangService } from '../../../../services/shared/lang/lang.service';
import { AppPagination } from '../../../../services/shared/misc/pagination.interfaces';
import { ResourcesService } from '../../../../services/shared/resources/resource.service';
import { CompletePaginationComponent } from '../../components/pagination/complete-pagination/complete-pagination.component';
import { EventsFilterComponent } from './components/event-filters/events-filter.component';
import labels from './events-page.lang';

@Component({
  standalone: true,
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  imports: [
    CommonModule,
    EventsFilterComponent,
    CompletePaginationComponent,
    RouterLink,
  ],
})
export class EventsPage implements OnInit {
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  public eventPosters: EventPoster[] = [];
  public loadingPosters: boolean = true;
  public error: boolean = false;
  public eventImages: string[] = [];
  public filterCriteria: EventFilterCriteria = {};
  public pagination: AppPagination = {
    totalElements: 0,
    pageSize: 30,
    currentPage: 1,
  };

  public constructor(
    private title: Title,
    private router: Router,
    private langService: LangService,
    private eventService: EventService,
    private resourcesService: ResourcesService,
  ) {}

  public ngOnInit(): void {
    if (location.href.includes('/intranet')) {
      this.variant = 'INTRANET';
    }
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

  public handleGoToPage(page: number) {
    this.pagination.currentPage = page;
    this.router.navigate(['/eventos'], {
      fragment: 'top',
      queryParams: { pagina: page },
      queryParamsHandling: 'merge',
    });
    this.fetchEventPosters();
  }

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('events', name);
  }

  public updateEventFilters(filterCriteria: EventFilterCriteria) {
    this.filterCriteria = filterCriteria;
    this.fetchEventPosters();
  }

  private fetchEventPosters() {
    this.loadingPosters = true;
    this.error = false;
    this.eventService
      .fetchEventPosters(
        {
          pagina: this.pagination.currentPage - 1,
          cantidad: this.pagination.pageSize,
        },
        this.filterCriteria,
      )
      .then(({ count, records }) => {
        this.pagination.totalElements = count;
        this.eventPosters = records;
      })
      .catch(() => {
        this.error = true;
      })
      .finally(() => {
        this.loadingPosters = false;
      });
  }

  public trimEventDescription(description: string) {
    if (description.length > 200) {
      return description.slice(0, 200) + '...';
    }
    return description;
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

  public formatEventDate(date: Date): string {
    return formatDate(date);
  }
}
