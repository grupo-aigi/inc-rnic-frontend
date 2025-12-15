import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  formatDate,
  formatDateByLang,
} from '../../../../../../../../helpers/date-formatters';
import { ScientificEcosystemDetailNews } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import labels from './scientific-ecosystem-convocations.lang';

@Component({
  standalone: true,
  selector: 'app-scientific-ecosystem-convocations',
  templateUrl: './scientific-ecosystem-convocations.component.html',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    CommonModule,
    RouterLink,
  ],
})
export class ScientificEcosystemConvocationsComponent implements OnInit {
  @Input() section!: ScientificEcosystemDetailNews;

  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  public constructor(
    private resourcesService: ResourcesService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    if (location.href.includes('/intranet')) {
      this.variant = 'INTRANET';
    }
  }

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('news', name);
  }

  public formatConvocationDate(date: Date): string {
    return formatDate(date);
  }

  public trimConvocationDescription(description: string) {
    if (description.length > 200) {
      return description.slice(0, 200) + '...';
    }
    return description;
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public getImageByEventId(name: string) {
    return this.resourcesService.getImageUrlByName('convocations', name);
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
