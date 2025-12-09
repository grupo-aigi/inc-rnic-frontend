import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LangService } from '../../../../../../../../../../../../services/shared/lang/lang.service';
import labels from './app-set-scientific-ecosystem-projects.lang';

@Component({
  standalone: true,
  templateUrl: './app-set-scientific-ecosystem-projects.component.html',
  imports: [],
  selector: 'app-set-scientific-ecosystem-projects',
})
export class SetScientificEcosystemProjectsComponent {
  public constructor(
    private title: Title,
    private langService: LangService,
  ) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }
}
