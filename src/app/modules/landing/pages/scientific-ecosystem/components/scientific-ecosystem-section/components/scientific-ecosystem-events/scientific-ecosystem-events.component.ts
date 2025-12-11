import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { formatDateByLang } from '../../../../../../../../helpers/date-formatters';
import { ScientificEcosystemDetailEvents } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { CompletePaginationComponent } from '../../../../../../components/pagination/complete-pagination/complete-pagination.component';
import labels from './scientific-ecosystem-events.lang';

@Component({
  standalone: true,
  selector: 'app-scientific-ecosystem-events',
  templateUrl: './scientific-ecosystem-events.component.html',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    CommonModule,
    RouterLink,
  ],
})
export class ScientificEcosystemEventsComponent implements OnInit {
  @Input() section!: ScientificEcosystemDetailEvents;

  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  public constructor(
    private resourcesService: ResourcesService,
    private langService: LangService,
  ) {}

  public events = [
    {
      id: 1,
      title: 'Some event',
      description: 'Some event description',
      imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
      urlName: 'evento-de-prueba',
      startDate: new Date(),
      endDate: new Date(),
      author: 'Some author',
      scope: 'NATIONAL',
      category: {
        id: 1,
        name: 'Cáncer Colorrectal',
      },
      tags: [],
      resources: [],
    },
    {
      id: 2,
      title: 'Some event 2',
      description: 'Some event description',
      imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
      urlName: 'evento-de-prueba',
      startDate: new Date(),
      endDate: new Date(),
      author: 'Some author',
      scope: 'NATIONAL',
      category: {
        id: 1,
        name: 'Cáncer Colorrectal',
      },
      tags: [],
      resources: [],
    },
    {
      id: 3,
      title: 'Some event 3',
      description: 'Some event description',
      imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
      urlName: 'evento-de-prueba',
      startDate: new Date(),
      endDate: new Date(),
      author: 'Some author',
      scope: 'NATIONAL',
      category: {
        id: 1,
        name: 'Cáncer Colorrectal',
      },
      tags: [],
      resources: [],
    },
    {
      id: 3,
      title: 'Some event 3',
      description: 'Some event description',
      imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
      urlName: 'evento-de-prueba',
      startDate: new Date(),
      endDate: new Date(),
      author: 'Some author',
      scope: 'NATIONAL',
      category: {
        id: 1,
        name: 'Cáncer Colorrectal',
      },
      tags: [],
      resources: [],
    },
    {
      id: 3,
      title: 'Some event 3',
      description: 'Some event description',
      imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
      urlName: 'evento-de-prueba',
      startDate: new Date(),
      endDate: new Date(),
      author: 'Some author',
      scope: 'NATIONAL',
      category: {
        id: 1,
        name: 'Cáncer Colorrectal',
      },
      tags: [],
      resources: [],
    },
    {
      id: 3,
      title: 'Some event 3',
      description: 'Some event description',
      imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
      urlName: 'evento-de-prueba',
      startDate: new Date(),
      endDate: new Date(),
      author: 'Some author',
      scope: 'NATIONAL',
      category: {
        id: 1,
        name: 'Cáncer Colorrectal',
      },
      tags: [],
      resources: [],
    },
  ];

  public ngOnInit(): void {
    if (location.href.includes('/intranet')) {
      this.variant = 'INTRANET';
    }
  }

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('events', name);
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public getImageByEventId(name: string) {
    return this.resourcesService.getImageUrlByName('events', name);
  }

  public trimEventDescription(description: string) {
    if (description.length > 200) {
      return description.slice(0, 200) + '...';
    }
    return description;
  }

  public formatDate(date: Date): string {
    return formatDateByLang(date, this.lang);
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
