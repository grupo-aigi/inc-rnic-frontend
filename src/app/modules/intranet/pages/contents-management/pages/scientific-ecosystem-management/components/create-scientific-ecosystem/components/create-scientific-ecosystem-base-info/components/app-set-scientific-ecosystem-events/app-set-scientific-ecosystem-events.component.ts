import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LangService } from '../../../../../../../../../../../../services/shared/lang/lang.service';
import labels from './app-set-scientific-ecosystem-events.lang';

@Component({
  standalone: true,
  templateUrl: './app-set-scientific-ecosystem-events.component.html',
  selector: 'app-set-scientific-ecosystem-events',
  imports: [],
})
export class SetScientificEcosystemEventsComponent {
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
