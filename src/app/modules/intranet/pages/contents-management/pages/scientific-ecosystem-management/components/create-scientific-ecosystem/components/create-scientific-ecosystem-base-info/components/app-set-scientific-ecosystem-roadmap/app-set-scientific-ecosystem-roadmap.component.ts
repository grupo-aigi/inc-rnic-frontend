import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LangService } from '../../../../../../../../../../../../services/shared/lang/lang.service';
import labels from './app-set-scientific-ecosystem-roadmap.lang';

@Component({
  standalone: true,
  templateUrl: './app-set-scientific-ecosystem-roadmap.component.html',
  imports: [],
  selector: 'app-set-scientific-ecosystem-roadmap',
})
export class SetScientificEcosystemRoadmapComponent {
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
