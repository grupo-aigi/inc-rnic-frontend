
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { PublicationInfo } from '../../../../../services/landing/publications/publications.interfaces';
import { PublicationService } from '../../../../../services/landing/publications/publications.service';
import { LangService } from '../../../../../services/shared/lang/lang.service';
import { AppPagination } from '../../../../../services/shared/misc/pagination.interfaces';
import { ResourcesService } from '../../../../../services/shared/resources/resource.service';
import { CompletePaginationComponent } from '../../../components/pagination/complete-pagination/complete-pagination.component';
import { PublicationFiltersComponent } from './components/publication-filters/publication-filters.component';
import { PublicationItemComponent } from './components/publication-item/publication-item.component';
import labels from './publications-page.lang';

@Component({
  standalone: true,
  templateUrl: './publications-page.component.html',
  imports: [
    RouterLink,
    PublicationFiltersComponent,
    CompletePaginationComponent,
    PublicationItemComponent
],
})
export class PublicationsPage implements OnInit {
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  public publicationPosters: PublicationInfo[] = [];
  public loadingPublications: boolean = true;
  public publicationImages: string[] = [];
  public searchTerm = '';
  public pagination: AppPagination = {
    totalElements: 0,
    pageSize: 10,
    currentPage: 1,
  };

  public constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private langService: LangService,
    private toastService: ToastrService,
    private resourcesService: ResourcesService,
    private publicationService: PublicationService,
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

  private fetchPublications() {
    this.loadingPublications = true;
    return this.publicationService
      .fetchPublications({
        page: this.pagination.currentPage - 1,
        size: this.pagination.pageSize,
        search: this.searchTerm,
      })
      .subscribe({
        next: ({ records, total }) => {
          this.publicationPosters = records;
          this.pagination.totalElements = total;
          this.loadingPublications = false;
          return this.fetchPublicationImages(records);
        },
        error: (error) => {
          this.toastService.error(labels.errorLoadingPublications[this.lang]);
          this.loadingPublications = false;
        },
      });
  }

  public handleGoToPage(page: number) {
    this.pagination.currentPage = page;
    this.router.navigate(['/publicaciones'], {
      fragment: 'top',
      queryParams: { pagina: page },
      queryParamsHandling: 'merge',
    });
  }

  private fetchPublicationImages(publications: PublicationInfo[]) {}

  public updatePublicationFilters(search: string) {
    this.searchTerm = search;
    this.fetchPublications();
  }
}
