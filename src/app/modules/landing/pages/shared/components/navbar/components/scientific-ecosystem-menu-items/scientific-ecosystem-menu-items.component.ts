import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './scientific-ecosystem-menu-items.lang';

@Component({
  standalone: true,
  selector: 'app-scientific-ecosystem-menu-items',
  templateUrl: './scientific-ecosystem-menu-items.component.html',
  imports: [RouterLink, RouterLinkActive],
})
export class ScientificEcosystemMenuItemsComponent {
  public constructor(private langService: LangService) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }
}
