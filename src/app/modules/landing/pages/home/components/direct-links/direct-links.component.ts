
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './direct-links.lang';
import { HomeDirectLink } from '../../../../../../services/shared/misc/direct-links.interfaces';
@Component({
  standalone: true,
  selector: 'app-direct-links',
  templateUrl: './direct-links.component.html',
  imports: [RouterLink],
})
export class DirectLinksComponent {
  public directLinks: HomeDirectLink[] = labels.links;

  constructor(private langService: LangService) {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }
}
