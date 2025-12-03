
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { EventPoster } from '../../../../services/landing/event/event.interfaces';
import { EventService } from '../../../../services/landing/event/event.service';
import { LangService } from '../../../../services/shared/lang/lang.service';
import { ResourceContentType1Component } from '../shared/components/resource-content-type1/resource-content-type1.component';
import { ResourceContentType10Component } from '../shared/components/resource-content-type10/resource-content-type10.component';
import { ResourceContentType11Component } from '../shared/components/resource-content-type11/resource-content-type11.component';
import { ResourceContentType12Component } from '../shared/components/resource-content-type12/resource-content-type12.component';
import { ResourceContentType13Component } from '../shared/components/resource-content-type13/resource-content-type13.component';
import { ResourceContentType14Component } from '../shared/components/resource-content-type14/resource-content-type14.component';
import { ResourceContentType2Component } from '../shared/components/resource-content-type2/resource-content-type2.component';
import { ResourceContentType3Component } from '../shared/components/resource-content-type3/resource-content-type3.component';
import { ResourceContentType4Component } from '../shared/components/resource-content-type4/resource-content-type4.component';
import { ResourceContentType5Component } from '../shared/components/resource-content-type5/resource-content-type5.component';
import { ResourceContentType6Component } from '../shared/components/resource-content-type6/resource-content-type6.component';
import { ResourceContentType7Component } from '../shared/components/resource-content-type7/resource-content-type7.component';
import { ResourceContentType8Component } from '../shared/components/resource-content-type8/resource-content-type8.component';
import { ResourceContentType9Component } from '../shared/components/resource-content-type9/resource-content-type9.component';
import { CurrentEventSummaryComponent } from './components/current-event-summary/current-event-summary.component';
import { CurrentEventTagsComponent } from './components/current-event-tags/current-event-tags.component';
import labels from './event-detail-page.lang';

@Component({
  standalone: true,
  selector: 'app-event-detail-page',
  templateUrl: './event-detail-page.component.html',
  imports: [
    RouterLink,
    CurrentEventTagsComponent,
    ResourceContentType1Component,
    ResourceContentType2Component,
    ResourceContentType3Component,
    ResourceContentType4Component,
    ResourceContentType5Component,
    ResourceContentType6Component,
    ResourceContentType7Component,
    ResourceContentType8Component,
    ResourceContentType9Component,
    ResourceContentType10Component,
    ResourceContentType11Component,
    ResourceContentType12Component,
    ResourceContentType13Component,
    ResourceContentType14Component,
    CurrentEventSummaryComponent
],
})
export class EventDetailPage implements OnInit {
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  public urlName: string = '';
  public eventDetail: EventPoster | null = null;
  public loadingEvent: boolean = false;

  public constructor(
    private meta: Meta,
    private title: Title,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    if (location.href.includes('/intranet')) {
      this.variant = 'INTRANET';
    }
    this.route.paramMap.subscribe((params) => {
      this.urlName = params.get('urlName') ?? '';
      if (!this.urlName) {
        return this.router.navigate(['/not-found']);
      }
      this.loadingEvent = true;
      return this.eventService
        .fetchEventPosterDetail(this.urlName)
        .subscribe({
          next: (eventDetail) => {
            this.eventDetail = eventDetail;
            this.setTagsAndTitle();
          },
          error: () => {
            return this.router.navigate(['/not-found']);
          },
        })
        .add(() => {
          this.loadingEvent = false;
        });
    });
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  private setTagsAndTitle() {
    const title = `${this.eventDetail!.title} | ${
      labels.pageTitleSuffix[this.lang]
    }`;
    this.title.setTitle(title);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(
        `${this.eventDetail!.title} | ${labels.pageTitleSuffix[lang]}`,
      );
    });
    this.meta.updateTag({
      property: 'og:title',
      content: title,
    });
    this.meta.updateTag({
      property: 'og:description',
      content: this.eventDetail!.description,
    });
    this.meta.updateTag({
      property: 'og:url',
      content: this.eventDetail!.urlName,
    });
  }
}
