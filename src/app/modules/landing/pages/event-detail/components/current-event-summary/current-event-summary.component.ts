import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import {
  formatDate,
  formatDateByLang,
} from '../../../../../../helpers/date-formatters';
import { EventPoster } from '../../../../../../services/landing/event/event.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';
import labels from './current-event-summary.lang';

@Component({
  standalone: true,
  selector: 'app-current-event-summary',
  templateUrl: './current-event-summary.component.html',
  imports: [CommonModule],
})
export class CurrentEventSummaryComponent {
  getEventScope(arg0: string) {
    throw new Error('Method not implemented.');
  }
  @Input() eventDetail!: EventPoster;

  public constructor(
    private resourcesService: ResourcesService,

    private langService: LangService,
  ) {}

  public getImageUrlByName() {
    return this.resourcesService.getImageUrlByName(
      'events',
      this.eventDetail!.imageName,
    );
  }

  public formatDate(date: Date) {
    return formatDate(date);
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

  public get lang() {
    return this.langService.language;
  }
  public get labels() {
    return labels;
  }
}
