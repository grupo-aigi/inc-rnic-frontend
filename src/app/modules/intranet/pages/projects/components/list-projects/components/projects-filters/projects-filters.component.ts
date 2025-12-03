
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import {
  ProjectFilterCriteria,
  ResearchLine,
} from '../../../../../../../../services/intranet/projects/projects.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { ProjectsFiltersChipsComponent } from '../projects-filters-chips/projects-filters-chips.component';
import { ProjectsFiltersRecommendationsComponent } from '../projects-filters-recommendations/projects-filters-recommendations.component';
import { ProjectsFiltersResetComponent } from '../projects-filters-reset/projects-filters-reset.component';
import labels from './projects-filters.lang';

@Component({
  standalone: true,
  selector: 'app-projects-filters',
  templateUrl: './projects-filters.component.html',
  imports: [
    FormsModule,
    ProjectsFiltersResetComponent,
    ProjectsFiltersChipsComponent,
    ProjectsFiltersRecommendationsComponent
],
})
export class ProjectsFilterComponent implements OnInit {
  @Output() onFiltersChange: EventEmitter<ProjectFilterCriteria> =
    new EventEmitter();
  public searchDebounce: Subject<string> = new Subject();
  public displaySearchOptions: boolean = false;
  public displayResetFiltersButton: boolean = false;
  public isFirstTime: boolean = true;
  public loadingRecommendations: boolean = false;
  public filterCriteria: ProjectFilterCriteria = {
    busqueda: '',
    linea: ResearchLine.TODAS,
  };

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    // this.onExecuteFilters.emit({ ...this.filterCriteria });

    this.route.queryParams.subscribe((params) => {
      const queryFilters = this.getQueryFilters(params);
      this.initInputs(queryFilters);
      if (this.isFirstTime) {
        this.onFiltersChange.emit(this.filterCriteria);
      } else {
        this.isFirstTime = false;
      }
    });

    this.searchDebounce.pipe(debounceTime(750)).subscribe((searchTerm) => {
      if (!searchTerm) return;
      this.filterCriteria.busqueda = searchTerm;
      this.displayResetFiltersButton = true;
      this.loadingRecommendations = true;
      this.onFiltersChange.emit({
        ...this.filterCriteria,
        busqueda: searchTerm,
      });
      setTimeout(() => {
        this.loadingRecommendations = false;
      }, 1000);
    });
  }

  private initInputs(queryFilters: ProjectFilterCriteria) {
    this.filterCriteria = queryFilters;
    if (queryFilters.busqueda)
      this.filterCriteria.busqueda = queryFilters.busqueda;

    if (queryFilters.linea) this.filterCriteria.linea = queryFilters.linea;
  }

  private getQueryFilters(params: Params) {
    const queryUrlFilters: ProjectFilterCriteria = {};
    if (params['busqueda']) queryUrlFilters.busqueda = params['busqueda'];
    if (params['linea']) {
      queryUrlFilters.linea = params['linea'] as ResearchLine;
    }
    return queryUrlFilters;
  }

  public handleUpdateProjects() {
    this.onFiltersChange.emit(this.filterCriteria);
  }

  public handleResetFilters() {
    this.filterCriteria = {
      busqueda: '',
    };
    this.displayResetFiltersButton = false;
    this.onFiltersChange.emit({ ...this.filterCriteria });
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleCloseSearchOptions(event: FocusEvent) {
    const { relatedTarget } = event;

    if (
      !relatedTarget ||
      !(relatedTarget instanceof HTMLButtonElement) ||
      !relatedTarget.classList.contains('recommendation-chip')
    ) {
      this.displaySearchOptions = false;
      return;
    }
  }

  public handleClickSearch(event: MouseEvent) {
    event.preventDefault();
    this.filterCriteria.busqueda = '';
    this.displaySearchOptions = false;
  }

  public async handleSearchByTerm($event: KeyboardEvent) {
    if ($event.key === 'Escape') {
      this.displaySearchOptions = false;
      return;
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { busqueda: this.filterCriteria.busqueda },
      queryParamsHandling: 'merge',
    });
    if ($event.key === 'Enter') {
      this.displaySearchOptions = false;
      return this.executeFilters();
    }
    this.searchDebounce.next(this.filterCriteria.busqueda || '');
  }

  private executeFilters() {
    this.onFiltersChange.emit(this.filterCriteria);
    this.displaySearchOptions = false;
  }

  public handleOpenOptions(event: MouseEvent) {
    event.preventDefault();
    this.displaySearchOptions = true;
  }
}
