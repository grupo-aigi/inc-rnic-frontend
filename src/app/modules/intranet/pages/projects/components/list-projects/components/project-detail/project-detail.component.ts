
import { Component, Input, OnInit } from '@angular/core';

import { ProjectInfo } from '../../../../../../../../services/intranet/projects/projects.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './project-detail.lang';

@Component({
  standalone: true,
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  imports: [],
})
export class ProjectDetailComponent implements OnInit {
  @Input() project!: ProjectInfo;

  public constructor(private langService: LangService) {}

  public ngOnInit(): void {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }
}
