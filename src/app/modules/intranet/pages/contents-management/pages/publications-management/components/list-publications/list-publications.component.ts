
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { formatDate } from '../../../../../../../../helpers/date-formatters';
import { PublicationInfo } from '../../../../../../../../services/landing/publications/publications.interfaces';
import { PublicationService } from '../../../../../../../../services/landing/publications/publications.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { AppPagination } from '../../../../../../../../services/shared/misc/pagination.interfaces';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { CompletePaginationComponent } from '../../../../../../../landing/components/pagination/complete-pagination/complete-pagination.component';
import { DeletePublicationConfirmationComponent } from './components/delete-publication-confirmation/delete-publication-confirmation.component';
import { IntranetPublicationFilters } from './components/publication-filters/publication-filters.component';
import labels from './list-publications.lang';

@Component({
  standalone: true,
  selector: 'app-list-publications',
  templateUrl: './list-publications.component.html',
  imports: [
    IntranetPublicationFilters,
    CompletePaginationComponent,
    DeletePublicationConfirmationComponent
],
})
export class ListPublicationsComponent implements OnInit {
  public publicationPosters: PublicationInfo[] = [];
  public loadingPublications: boolean = true;
  public publicationImages: string[] = [];
  public expandedPublications: string[] = [];
  @Output() public onEditPublication: EventEmitter<PublicationInfo> =
    new EventEmitter();
  public searchTerm = '';
  public pagination: AppPagination = {
    totalElements: 0,
    pageSize: 10,
    currentPage: 1,
  };

  public activePublication: PublicationInfo | null = null;

  public constructor(
    private publicationService: PublicationService,
    private langService: LangService,
    private toastService: ToastrService,
    private route: ActivatedRoute,
    private resourcesService: ResourcesService,
    private router: Router,
  ) {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const { pagina } = params;
      if (!pagina) {
        this.pagination.currentPage = 1;
        this.fetchPublications();
        return;
      }
      if (isNaN(+pagina)) {
        this.toastService.error(labels.invalidPage[this.lang]);
        this.router.navigate(['/'], {});
        return;
      }
      this.pagination.currentPage = +pagina;
      this.fetchPublications();
    });
  }

  public setActivePublication(publication: PublicationInfo) {
    this.activePublication = publication;
  }

  public updatePublicationFilters(search: string) {
    this.searchTerm = search;
    this.fetchPublications();
  }

  private fetchPublications() {
    this.loadingPublications = true;
    this.publicationService
      .fetchPublications({
        page: this.pagination.currentPage - 1,
        size: this.pagination.pageSize,
        search: this.searchTerm,
      })
      .subscribe({
        next: ({ records, total }) => {
          this.publicationPosters = records;
          this.loadingPublications = false;
          this.pagination.totalElements = total;
        },
        error: (error) => {
          this.toastService.error(labels.errorLoadingPublications[this.lang]);
          this.loadingPublications = false;
        },
      });
  }

  public handleGoToPage(page: number) {
    this.pagination.currentPage = page;
    this.router.navigate(['/intranet/gestion-contenido/publicaciones'], {
      fragment: 'top',
      queryParams: { pagina: page },
      queryParamsHandling: 'merge',
    });
    setTimeout(() => {
      this.fetchPublications();
    }, 1000);
  }

  public handleEditPublication(publication: PublicationInfo): void {
    this.onEditPublication.emit(publication);
  }

  public handleConfirmDelete(id: string) {
    return this.publicationService.deletePublication(id).subscribe({
      next: () => {
        this.toastService.success(labels.publicationDeleted[this.lang]);
        this.publicationPosters = this.publicationPosters.filter(
          (publication) => publication.id !== id,
        );
        this.activePublication = null;
      },
      error: () => {
        this.toastService.error(labels.errorDeletingPublication[this.lang]);
      },
    });
  }

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('publications', name);
  }

  public formatDate(date: Date): string {
    return formatDate(date);
  }
}
