import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';

import { formatDate } from '../../../../helpers/date-formatters';
import {
  ConvocationFilterCriteria,
  ConvocationPoster,
} from '../../../../services/landing/convocation/convocation.interfaces';
import { ConvocationService } from '../../../../services/landing/convocation/convocation.service';
import { LangService } from '../../../../services/shared/lang/lang.service';
import { AppPagination } from '../../../../services/shared/misc/pagination.interfaces';
import { ResourcesService } from '../../../../services/shared/resources/resource.service';
import { CompletePaginationComponent } from '../../components/pagination/complete-pagination/complete-pagination.component';
import { ConvocationsFilterComponent } from './components/convocations-filters/convocations-filter.component';
import labels from './convocations-page.lang';

@Component({
  standalone: true,
  selector: 'app-convocations-page',
  templateUrl: './convocations-page.component.html',
  imports: [
    CommonModule,
    ConvocationsFilterComponent,
    CompletePaginationComponent,
    RouterLink,
  ],
})
export class ConvocationsPage implements OnInit {
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';
  public convocationPosters: ConvocationPoster[] = [];
  public loadingPosters: boolean = true;
  public error: boolean = false;
  public filterCriteria: ConvocationFilterCriteria = {};
  public pagination: AppPagination = {
    totalElements: 0,
    pageSize: 30,
    currentPage: 1,
  };

  public constructor(
    private title: Title,
    private router: Router,
    private langService: LangService,
    private resourcesService: ResourcesService,
    private convocationService: ConvocationService,
  ) {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public ngOnInit(): void {
    if (location.href.includes('/intranet')) {
      this.variant = 'INTRANET';
    }
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });
  }

  public handleGoToPage(page: number) {
    this.pagination.currentPage = page;
    this.router.navigate(['/convocatorias'], {
      fragment: 'top',
      queryParams: { pagina: page },
      queryParamsHandling: 'merge',
    });
    this.fetchConvocationPosters();
  }

  private fetchConvocationPosters() {
    this.loadingPosters = true;
    this.error = false;
    this.convocationService
      .fetchConvocationPosters(
        {
          pagina: this.pagination.currentPage - 1,
          cantidad: this.pagination.pageSize,
        },
        this.filterCriteria,
      )
      .then(({ count, records }) => {
        this.pagination.totalElements = count;
        this.convocationPosters = records;
        this.loadingPosters = false;
      })
      .catch(() => {
        this.error = true;
      })
      .finally(() => {
        this.loadingPosters = false;
      });
  }

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('convocations', name);
  }

  public trimConvocationDescription(description: string) {
    if (description.length > 200) {
      return description.slice(0, 200) + '...';
    }
    return description;
  }

  public updateConvocationFilters(filterCriteria: ConvocationFilterCriteria) {
    this.filterCriteria = filterCriteria;
    this.fetchConvocationPosters();
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

  public formatConvocationDate(date: Date): string {
    return formatDate(date);
  }
}
