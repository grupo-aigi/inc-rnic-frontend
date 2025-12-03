
import { Component } from '@angular/core';

import {
  ProjectFilterCriteria,
  ProjectInfo,
} from '../../../../../../services/intranet/projects/projects.interfaces';
import { ProjectsService } from '../../../../../../services/intranet/projects/projects.service';
import { AppPagination } from '../../../../../../services/shared/misc/pagination.interfaces';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { ProjectsFilterComponent } from './components/projects-filters/projects-filters.component';

@Component({
  standalone: true,
  selector: 'app-list-projects',
  templateUrl: './list-projects.component.html',
  imports: [ProjectsFilterComponent, ProjectCardComponent],
})
export class projectsListComponent {
  public showDetail: boolean = false;
  public loading: boolean = true;
  public projects: ProjectInfo[] = [];
  public filterCriteria: ProjectFilterCriteria = {};
  public pagination: AppPagination = {
    totalElements: 0,
    pageSize: 20,
    currentPage: 1,
  };

  public constructor(private projectsService: ProjectsService) {}

  public toggleDetail() {
    this.showDetail = !this.showDetail;
  }

  public handleUpdateProjects(filterCriteria: ProjectFilterCriteria) {
    this.filterCriteria = filterCriteria;
    this.pagination.currentPage = 1;
    this.fetchProjects();
  }

  private fetchProjects() {
    this.loading = true;
    this.projectsService
      .fetchProjects(
        {
          page: this.pagination.currentPage - 1,
          size: this.pagination.pageSize,
        },
        this.filterCriteria,
      )
      .then((projects) => {
        this.projects = projects;
        this.loading = false;
      });
  }
}
