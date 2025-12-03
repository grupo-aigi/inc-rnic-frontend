import { Component } from '@angular/core';

import { isEnabled } from 'darkreader';

import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './footer.lang';


@Component({
  standalone: true,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [],
})
export class FooterComponent {
  public constructor(private langService: LangService) {}

  public get labels() {
    return labels;
  }

  public get theme() {
    return isEnabled() ? 'DARK' : 'LIGHT';
  }

  public get lang() {
    return this.langService.language;
  }
}
