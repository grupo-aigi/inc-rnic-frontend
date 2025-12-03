import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { formatDate } from '../../../../../../../../helpers/date-formatters';
import { MemoryInfo } from '../../../../../../../../services/landing/memories/memories.interfaces';
import { MemoriesService } from '../../../../../../../../services/landing/memories/memories.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { AppPagination } from '../../../../../../../../services/shared/misc/pagination.interfaces';
import { CompletePaginationComponent } from '../../../../../../../landing/components/pagination/complete-pagination/complete-pagination.component';
import { MemoriesFiltersComponent } from '../../../../../../../landing/pages/memories/components/memories-filters/memories-filters.component';
import { MemoryItemComponent } from '../../../../../../../landing/pages/memories/components/memory-item/memory-item.component';
import { DeleteMemoryConfirmationComponent } from './components/delete-memory-confirmation/delete-memory-confirmation.component';
import labels from './list-memories.lang';

@Component({
  standalone: true,
  selector: 'app-list-memories',
  templateUrl: './list-memories.component.html',
  imports: [
    CommonModule,
    MemoryItemComponent,
    MemoriesFiltersComponent,
    CompletePaginationComponent,
    DeleteMemoryConfirmationComponent,
  ],
})
export class ListMemoriesComponent implements OnInit {
  @Output() public onEditMemory: EventEmitter<MemoryInfo> = new EventEmitter();
  public memoryPosters: MemoryInfo[] = [];
  public loadingMemories: boolean = true;
  public memoryImages: string[] = [];
  public expandedMemories: string[] = [];
  public searchTerm = '';
  public pagination: AppPagination = {
    totalElements: 0,
    pageSize: 10,
    currentPage: 1,
  };

  public memoryToDelete: MemoryInfo | null = null;
  public activeMemory: MemoryInfo | null = null;

  public constructor(
    private memoryService: MemoriesService,
    private langService: LangService,
    private toastService: ToastrService,
    private route: ActivatedRoute,
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

  public setActiveMemory(id: number) {
    if (this.activeMemory && this.activeMemory.id === id) {
      this.activeMemory = null;
      return;
    }
    const memory = this.memoryPosters.find((memory) => memory.id === id);
    if (!memory) return;

    this.activeMemory = memory;
  }

  public updateMemoryFilters(search: string) {
    this.searchTerm = search;
    this.fetchMemories();
  }

  private fetchMemories() {
    this.loadingMemories = true;
    this.memoryService
      .fetchMemories({
        pagina: this.pagination.currentPage - 1,
        cantidad: this.pagination.pageSize,
        busqueda: this.searchTerm,
      })
      .subscribe({
        next: ({ records, count }) => {
          this.memoryPosters = records;
          this.loadingMemories = false;
          this.pagination.totalElements = count;
        },
        error: (error) => {
          this.toastService.error(labels.errorLoadingMemories[this.lang]);
          this.loadingMemories = false;
        },
      });
  }

  public handleSetMemoryToDelete(memoryInfo: MemoryInfo) {
    this.memoryToDelete = memoryInfo;
  }

  public handleGoToPage(page: number) {
    this.pagination.currentPage = page;
    this.router.navigate(['/intranet/gestion-contenido/memorias'], {
      fragment: 'top',
      queryParams: { pagina: page },
      queryParamsHandling: 'merge',
    });
    setTimeout(() => {
      this.fetchMemories();
    }, 1000);
  }

  public handleEditMemory(memory: MemoryInfo): void {
    this.onEditMemory.emit(memory);
  }

  public handleConfirmDelete(id: number) {
    return this.memoryService.deleteMemory(id).subscribe({
      next: () => {
        this.toastService.success(labels.memoryDeleted[this.lang]);
        this.memoryPosters = this.memoryPosters.filter(
          (memory) => memory.id !== id,
        );
        this.memoryToDelete = null;
      },
      error: () => {
        this.toastService.error(labels.errorDeletingMemory[this.lang]);
      },
    });
  }

  public formatDate(date: Date): string {
    return formatDate(date);
  }
}
