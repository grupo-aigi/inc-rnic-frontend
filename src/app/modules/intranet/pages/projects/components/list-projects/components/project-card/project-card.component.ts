import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../../../../../../services/auth/auth.service';
import {
  ProjectInfo,
  ProjectMission,
  ResearchLine,
  projectMissions,
  researchLines,
} from '../../../../../../../../services/intranet/projects/projects.interfaces';
import { ProjectsService } from '../../../../../../../../services/intranet/projects/projects.service';
import { AppLanguage } from '../../../../../../../../services/shared/lang/lang.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { ProjectDetailComponent } from '../project-detail/project-detail.component';
import labels from './project-card.lang';

@Component({
  standalone: true,
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  imports: [CommonModule, ProjectDetailComponent],
})
export class ProjectCardComponent implements OnInit {
  @Input() project!: ProjectInfo;

  public showDetail: boolean = false;

  public constructor(
    private projectService: ProjectsService,
    private toastService: ToastrService,
    private authService: AuthService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
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

  public getMissionName(mission: ProjectMission, lang: AppLanguage) {
    return projectMissions.find((m) => m.name === mission)![lang];
  }

  public getResearchName(researchLine: ResearchLine, lang: AppLanguage) {
    return researchLines.find((r) => r.name === researchLine)![lang];
  }

  public toggleDetail() {
    this.showDetail = !this.showDetail;
  }
}
