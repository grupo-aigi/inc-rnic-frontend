import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { formatDate } from '../../../../../../../../helpers/date-formatters';
import {
  ConvocationFilterCriteria,
  ConvocationPoster,
} from '../../../../../../../../services/landing/convocation/convocation.interfaces';
import { ConvocationService } from '../../../../../../../../services/landing/convocation/convocation.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { AppPagination } from '../../../../../../../../services/shared/misc/pagination.interfaces';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { CompletePaginationComponent } from '../../../../../../../landing/components/pagination/complete-pagination/complete-pagination.component';
import { ConvocationsFilterComponent } from '../../../../../../../landing/pages/convocations/components/convocations-filters/convocations-filter.component';
import { DeleteConvocationConfirmationComponent } from './components/delete-convocation-confirmation/delete-convocation-confirmation.component';
import labels from './list-convocations.lang';

@Component({
  standalone: true,
  selector: 'app-list-convocations',
  templateUrl: './list-convocations.component.html',
  imports: [
    RouterLink,
    CommonModule,
    ConvocationsFilterComponent,
    CompletePaginationComponent,
    DeleteConvocationConfirmationComponent,
  ],
})
export class ListConvocationsComponent implements OnInit {
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  @Output() public onEditConvocation: EventEmitter<ConvocationPoster> =
    new EventEmitter();
  public loadingPosters: boolean = true;
  public convocationPosters: ConvocationPoster[] = [];
  public convocationToDelete: ConvocationPoster | null = null;
  public convocationImages: string[] = [];
  public currentPage: number = 0;
  public pageSize: number = 9;
  public filterCriteria: ConvocationFilterCriteria = {};
  public pagination: AppPagination = {
    totalElements: 0,
    pageSize: 10,
    currentPage: 1,
  };

  public constructor(
    private convocationService: ConvocationService,
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
  }

  public handleSetConvocationToDelete(convocationPoster: ConvocationPoster) {
    this.convocationToDelete = convocationPoster;
  }

  private processFetchedConvocations(
    convocationPosters: ConvocationPoster[],
  ): any {
    this.loadingPosters = false;
    this.convocationPosters = convocationPosters.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
  }

  public formatConvocationDate(date: Date): string {
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

  public getImageUrlByName(imageName: string) {
    return this.resourcesService.getImageUrlByName('convocations', imageName);
  }

  public handleConfirmDelete(id: number) {
    return this.convocationService.removeConvocation(id).then(({ id }) => {
      if (id) {
        this.convocationPosters = this.convocationPosters.filter(
          (convocationPoster) => convocationPoster.id !== id,
        );
        this.convocationToDelete = null;
        return this.toastService.success(
          labels.convocationDeletedSuccessfully[this.lang],
        );
      }
      return this.toastService.error(labels.convocationNotDeleted[this.lang]);
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
    this.router.navigate(['/intranet/gestion-contenido/convocatorias'], {
      fragment: 'top',
      queryParams: { pagina: page },
      queryParamsHandling: 'merge',
    });
    setTimeout(() => {
      this.fetchConvocations();
    }, 1000);
  }

  private fetchConvocations() {
    this.loadingPosters = true;
    this.convocationService
      .fetchConvocationPosters({
        pagina: this.pagination.currentPage - 1,
        cantidad: this.pagination.pageSize,
      })
      .then(({ records, count }) => {
        this.pagination.totalElements = count;
        this.processFetchedConvocations(records);
      });
  }

  public getImageByConvocationId(name: string) {
    return this.resourcesService.getImageUrlByName('convocations', name);
  }

  public handlePreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateConvocationFilters(this.filterCriteria);
    }
  }

  public handleNextPage() {
    if (this.convocationPosters.length < this.pageSize) return;
    this.currentPage++;
    this.updateConvocationFilters(this.filterCriteria);
  }

  public updateConvocationFilters(filterCriteria: ConvocationFilterCriteria) {
    this.filterCriteria = filterCriteria;
    this.loadingPosters = true;
    this.convocationService
      .fetchConvocationPosters(
        { pagina: this.pagination.currentPage - 1, cantidad: this.pageSize },
        filterCriteria,
      )
      .then(({ records, count }) => {
        this.pagination.totalElements = count;
        this.processFetchedConvocations(records);
      });
  }

  public handleEditConvocation(convocationPoster: ConvocationPoster) {
    this.onEditConvocation.emit(convocationPoster);
  }

  public trimConvocationDescription(description: string) {
    if (description.length > 200) {
      return description.slice(0, 200) + '...';
    }
    return description;
  }

  public formatDate(date: Date): string {
    return formatDate(date, false);
  }
}
