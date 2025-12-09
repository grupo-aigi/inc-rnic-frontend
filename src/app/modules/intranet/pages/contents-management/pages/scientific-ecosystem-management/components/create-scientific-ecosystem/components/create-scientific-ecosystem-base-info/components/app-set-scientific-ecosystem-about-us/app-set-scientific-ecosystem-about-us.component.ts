import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LangService } from '../../../../../../../../../../../../services/shared/lang/lang.service';
import labels from './app-set-scientific-ecosystem-about-us.lang';

@Component({
  standalone: true,
  templateUrl: './app-set-scientific-ecosystem-about-us.component.html',
  selector: 'app-set-scientific-ecosystem-about-us',
  imports: [],
})
export class SetScientificEcosystemAboutUsComponent {
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
