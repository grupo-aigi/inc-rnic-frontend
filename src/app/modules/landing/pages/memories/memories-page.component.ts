import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { formatDate } from '../../../../helpers/date-formatters';
import { MemoryInfo } from '../../../../services/landing/memories/memories.interfaces';
import { MemoriesService } from '../../../../services/landing/memories/memories.service';
import { LangService } from '../../../../services/shared/lang/lang.service';
import { AppPagination } from '../../../../services/shared/misc/pagination.interfaces';
import { CompletePaginationComponent } from '../../components/pagination/complete-pagination/complete-pagination.component';
import { MemoriesFiltersComponent } from './components/memories-filters/memories-filters.component';
import { MemoryItemComponent } from './components/memory-item/memory-item.component';
import labels from './memories-page.lang';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  templateUrl: './memories-page.component.html',
  imports: [
    CommonModule,
    RouterLink,
    MemoryItemComponent,
    MemoriesFiltersComponent,
    CompletePaginationComponent,
  ],
})
export class MemoriesPage implements OnInit {
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  @ViewChild('openClosePopup')
  public openClosePopup!: ElementRef<HTMLButtonElement>;

  public memoryPosters: MemoryInfo[] = [];
  public loadingMemories: boolean = true;
  public searchTerm = '';
  public activeMemory: MemoryInfo | null = null;
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
    private memoriesService: MemoriesService,
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
    this.route.queryParams.subscribe((params) => {
      const { pagina } = params;
      if (!pagina) {
        this.pagination.currentPage = 1;
        this.fetchMemories();
        return;
      }
      if (isNaN(+pagina)) {
        this.toastService.error(labels.invalidPage[this.lang]);
        this.router.navigate(['/'], {});
        return;
      }
      this.pagination.currentPage = +pagina;
      this.fetchMemories();
    });
  }

  public handleSetActiveMemory(memoryId: number) {
    const memory = this.memoryPosters.find((memory) => memory.id === memoryId);
    if (!memory) return;
    if (memoryId === this.activeMemory?.id) {
      this.activeMemory = null;
      return;
    }
    this.activeMemory = memory;
    this.openClosePopup.nativeElement.click();
  }

  private fetchMemories() {
    this.loadingMemories = true;
    this.activeMemory = null;
    return this.memoriesService
      .fetchMemories({
        pagina: this.pagination.currentPage - 1,
        cantidad: this.pagination.pageSize,
        busqueda: this.searchTerm,
      })
      .subscribe({
        next: ({ records, count }) => {
          this.memoryPosters = records;
          this.pagination.totalElements = count;
          this.loadingMemories = false;
          if (count === 1) {
            this.handleSetActiveMemory(records[0].id!);
          }
        },
        error: (error) => {
          this.toastService.error(labels.errorLoadingMemories[this.lang]);
          this.loadingMemories = false;
        },
      });
  }

  public handleGoToPage(page: number) {
    this.pagination.currentPage = page;
    this.router.navigate(['/memorias'], {
      fragment: 'top',
      queryParams: { pagina: page },
      queryParamsHandling: 'merge',
    });
  }

  public updateMemoryFilters(search: string) {
    this.searchTerm = search;
    this.pagination.currentPage = 1;
    this.router.navigate(['/memorias'], {
      fragment: 'top',
      queryParams: { busqueda: search },
      queryParamsHandling: 'merge',
    });
    this.fetchMemories();
  }

  public formatDate(date: Date): string {
    return formatDate(date);
  }
}
