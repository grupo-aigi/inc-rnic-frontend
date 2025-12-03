import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { formatDate } from '../../../../../../../../helpers/date-formatters';
import {
  EventFilterCriteria,
  EventPoster,
} from '../../../../../../../../services/landing/event/event.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { AppPagination } from '../../../../../../../../services/shared/misc/pagination.interfaces';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { EventService } from '../../../../../../../landing/../../services/landing/event/event.service';
import { CompletePaginationComponent } from '../../../../../../../landing/components/pagination/complete-pagination/complete-pagination.component';
import { EventsFilterComponent } from '../../../../../../../landing/pages/events/components/event-filters/events-filter.component';
import { DeleteEventConfirmationComponent } from './components/delete-event-confirmation/delete-event-confirmation.component';
import labels from './list-events.lang';

@Component({
  standalone: true,
  selector: 'app-list-events',
  templateUrl: './list-events.component.html',
  imports: [
    RouterLink,
    CommonModule,
    EventsFilterComponent,
    CompletePaginationComponent,
    DeleteEventConfirmationComponent,
  ],
})
export class ListEventsComponent implements OnInit {
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  @Output() public onEditEvent: EventEmitter<EventPoster> = new EventEmitter();
  public loadingPosters: boolean = true;
  public eventPosters: EventPoster[] = [];
  public eventToDelete: EventPoster | null = null;
  public currentPage: number = 0;
  public pageSize: number = 9;
  public filterCriteria: EventFilterCriteria = {};
  public pagination: AppPagination = {
    totalElements: 0,
    pageSize: 10,
    currentPage: 1,
  };

  public constructor(
    private eventService: EventService,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private resourcesService: ResourcesService,
    private toastService: ToastrService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    if (location.href.includes('/intranet')) {
      this.variant = 'INTRANET';
    }
    this.route.queryParams.subscribe((params) => {
      const { pagina } = params;
      if (!pagina) {
        this.pagination.currentPage = 1;
        this.fetchEvents();
        return;
      }
      if (isNaN(+pagina)) {
        this.toastService.error(labels.invalidPage[this.lang]);
        this.router.navigate(['/'], {});
        return;
      }
      this.pagination.currentPage = +pagina;
      this.fetchEvents();
    });
  }

  public handleSetEventToDelete(eventPoster: EventPoster) {
    this.eventToDelete = eventPoster;
  }

  private processFetchedEvents(eventPosters: EventPoster[]): any {
    this.loadingPosters = false;
    this.eventPosters = eventPosters.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
  }

  public handleConfirmDelete(id: number) {
    return this.eventService.removeEvent(id).then(({ id }) => {
      if (id) {
        this.eventPosters = this.eventPosters.filter(
          (eventPoster) => eventPoster.id !== id,
        );
        this.eventToDelete = null;
        return this.toastService.success(
          labels.eventDeletedSuccessfully[this.lang],
        );
      }
      return this.toastService.error(labels.eventNotDeleted[this.lang]);
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
    this.router.navigate(['/intranet/gestion-contenido/eventos'], {
      fragment: 'top',
      queryParams: { pagina: page },
      queryParamsHandling: 'merge',
    });
    setTimeout(() => {
      this.fetchEvents();
    }, 1000);
  }

  private fetchEvents() {
    this.loadingPosters = true;
    this.eventService
      .fetchEventPosters({
        pagina: this.pagination.currentPage - 1,
        cantidad: this.pagination.pageSize,
      })
      .then(({ records, count }) => {
        this.pagination.totalElements = count;
        this.processFetchedEvents(records);
      });
  }

  public getImageByEventId(name: string) {
    return this.resourcesService.getImageUrlByName('events', name);
  }

  public handlePreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateEventFilters(this.filterCriteria);
    }
  }

  public handleNextPage() {
    if (this.eventPosters.length < this.pageSize) return;
    this.currentPage++;
    this.updateEventFilters(this.filterCriteria);
  }

  public updateEventFilters(filterCriteria: EventFilterCriteria) {
    this.filterCriteria = filterCriteria;
    this.loadingPosters = true;
    this.eventService
      .fetchEventPosters(
        { pagina: this.pagination.currentPage - 1, cantidad: this.pageSize },
        filterCriteria,
      )
      .then(({ records, count }) => {
        this.pagination.totalElements = count;
        this.processFetchedEvents(records);
      });
  }

  public handleEditEvent(eventPoster: EventPoster) {
    this.onEditEvent.emit(eventPoster);
  }

  public trimEventDescription(description: string) {
    if (description.length > 200) {
      return description.slice(0, 200) + '...';
    }
    return description;
  }

  public formatDate(date: Date): string {
    return formatDate(date, false);
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
}
