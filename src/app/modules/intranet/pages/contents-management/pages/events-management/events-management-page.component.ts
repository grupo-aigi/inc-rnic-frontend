
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { ListEventsComponent } from './components/list-events/list-events.component';
import labels from './events-management-page.language';
import {
  EventCreateInfo,
  EventPoster,
} from '../../../../../../services/landing/event/event.interfaces';
import { EventService } from '../../../../../../services/landing/event/event.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  templateUrl: './events-management-page.component.html',
  imports: [ListEventsComponent, CreateEventComponent],
})
export class EventsManagementPage {
  public activeTabIndex: number = 0;
  public eventToEdit: EventPoster | undefined;

  @ViewChild('allEventsTab') public allEventsTab!: ElementRef<HTMLLIElement>;

  public constructor(
    private title: Title,
    private langService: LangService,
    private toastService: ToastrService,
    private eventService: EventService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });
  }

  public handleRedirectToEventsTab() {
    this.allEventsTab.nativeElement.click();
    this.activeTabIndex = 1;
  }

  public changeActiveTab(index: number): void {
    if (index === 0 && this.eventToEdit) {
      this.eventToEdit = undefined;
    }
    this.activeTabIndex = index;
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleEditEvent(event: EventPoster) {
    this.eventToEdit = event;
    this.changeActiveTab(1);
  }

  public submitEvent(eventInfo: EventCreateInfo) {
    if (this.eventToEdit) {
      return this.eventService.updateEvent(eventInfo).subscribe({
        next: (value) => {
          this.toastService.success(labels.eventUpdatedSuccessfully[this.lang]);
          this.allEventsTab.nativeElement.click();
          this.activeTabIndex = 0;
          this.eventToEdit = undefined;
        },
        error: (_err) => {
          this.toastService.error(this.labels.errorUpdatingEvent[this.lang]);
        },
      });
    }

    return this.eventService.createEvent(eventInfo).subscribe({
      next: (value) => {
        this.toastService.success(labels.eventCreatedSuccessfully[this.lang]);
        this.allEventsTab.nativeElement.click();
        this.activeTabIndex = 0;
      },
      error: (_err) => {
        this.toastService.error(this.labels.errorCreatingEvent[this.lang]);
      },
    });
  }

  public handleCancelUpdate() {
    this.toastService.info(labels.updateCancelled[this.lang]);
    this.eventToEdit = undefined;
    this.changeActiveTab(0);
    this.allEventsTab.nativeElement.click();
  }
}
