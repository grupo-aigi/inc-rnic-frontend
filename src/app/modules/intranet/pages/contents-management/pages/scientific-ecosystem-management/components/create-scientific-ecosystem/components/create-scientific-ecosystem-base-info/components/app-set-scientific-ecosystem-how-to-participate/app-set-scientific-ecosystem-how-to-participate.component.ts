import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ContentTarget } from '../../../../../../../../../../../../services/shared/contents/contents.interfaces';
import { LangService } from '../../../../../../../../../../../../services/shared/lang/lang.service';
import labels from './app-set-scientific-ecosystem-how-to-participate.lang';

@Component({
  standalone: true,
  templateUrl:
    './app-set-scientific-ecosystem-how-to-participate.component.html',
  imports: [],
  selector: 'app-set-scientific-ecosystem-how-to-participate',
})
export class SetScientificEcosystemHowToParticipateComponent {
  @Input() public target!: ContentTarget;

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
