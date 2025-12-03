
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../../services/auth/auth.service';
import {
  ProjectCreateInfo,
  ProjectInfo,
} from '../../../../services/intranet/projects/projects.interfaces';
import { ProjectsService } from '../../../../services/intranet/projects/projects.service';
import { LangService } from '../../../../services/shared/lang/lang.service';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { projectsListComponent } from './components/list-projects/list-projects.component';
import labels from './projects-page.lang';

@Component({
  standalone: true,
  templateUrl: './projects-page.component.html',
  imports: [projectsListComponent, CreateProjectComponent],
})
export class ProjectsPage implements OnInit {
  public activeTabIndex: number = 0;
  @ViewChild('listProjectsLI')
  public $listProjectsLI!: ElementRef<HTMLLIElement>;
  public loading: boolean = true;
  public currentPage: number = 0;
  public pageSize: number = 9;
  public projects: ProjectInfo[] = [];

  public constructor(
    private title: Title,
    private langService: LangService,
    private authService: AuthService,
    private toastService: ToastrService,
    private projectsService: ProjectsService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(this.labels.title[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(this.labels.title[lang]);
    });
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public createProject(projectInfo: ProjectCreateInfo) {
    return this.projectsService.createProject(projectInfo).subscribe({
      next: () => {
        this.toastService.success('Proyecto creado correctamente');
        this.$listProjectsLI.nativeElement.click();
        this.activeTabIndex = 0;
      },
      error: (err) => {
        this.toastService.error('Error al crear el proyecto');
      },
    });
  }

  public changeActiveTab(index: number): void {
    this.activeTabIndex = index;
  }
}
