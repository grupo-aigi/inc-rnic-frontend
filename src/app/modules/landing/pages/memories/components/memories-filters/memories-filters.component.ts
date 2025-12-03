
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { formatDate } from '../../../../../../helpers/date-formatters';
import { RecommendedMemory } from '../../../../../../services/landing/memories/memories.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './memories-filters.lang';

@Component({
  standalone: true,
  selector: 'app-memories-filters',
  templateUrl: './memories-filters.component.html',
  imports: [FormsModule],
})
export class MemoriesFiltersComponent implements OnInit {
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  @Output() onFiltersChange: EventEmitter<string> = new EventEmitter();
  public searchDebounce: Subject<string> = new Subject();
  public showFiltersButton: boolean = true;
  public searchTerm: string = '';
  public loadingRecommendations: boolean = false;
  public isFirstTime: boolean = true;

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    if (location.href.includes('/intranet')) {
      this.variant = 'INTRANET';
    }
    this.route.queryParams.subscribe((params) => {
      this.initInputs(params);
      if (this.isFirstTime) {
        this.onFiltersChange.emit(this.searchTerm);
      } else {
        this.isFirstTime = false;
      }
    });

    this.searchDebounce.pipe(debounceTime(750)).subscribe((searchTerm) => {
      if (!searchTerm) return;
      this.onFiltersChange.emit(searchTerm);
      this.loadingRecommendations = true;

      setTimeout(() => {
        this.loadingRecommendations = false;
      }, 1000);

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { busqueda: searchTerm },
        queryParamsHandling: 'merge',
      });
    });
  }

  private initInputs(params: Params) {
    this.searchTerm = params['busqueda'] || '';
  }

  public handleClearSearch(event: MouseEvent) {
    this.searchTerm = '';
    this.onFiltersChange.emit('');
  }

  public handleSelectOption(memory: RecommendedMemory) {}

  public handleClickSearch(event: MouseEvent) {
    event.preventDefault();
    this.searchTerm = '';
  }

  public async handleSearchByTerm($event: KeyboardEvent) {
    if ($event.key === 'Escape') {
      return;
    } else if ($event.key === 'Enter') {
      return this.executeFilters(); // Display all the recommended elements
    }
    this.searchDebounce.next(this.searchTerm);
  }

  public showFilters() {
    this.showFiltersButton = false;
  }

  public executeFilters() {
    this.onFiltersChange.emit(this.searchTerm); // EMIT ACTUAL VALUES
  }

  public clearFilters(event: MouseEvent) {
    event.preventDefault();
    this.showFiltersButton = true;
    this.searchTerm = '';
    this.router.navigate([], {
      relativeTo: this.route,
    });
    this.onFiltersChange.emit('');
  }

  public formatMemoryDate(date: Date): string {
    return formatDate(date);
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  handleSubmit() {}
}
