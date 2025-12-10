import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ScientificEcosystemService } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './scientific-ecosystem-menu-items.lang';
import { ScientificEcosystemPoster } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';

@Component({
  standalone: true,
  selector: 'app-scientific-ecosystem-menu-items',
  templateUrl: './scientific-ecosystem-menu-items.component.html',
  imports: [RouterLink, RouterLinkActive, JsonPipe],
})
export class ScientificEcosystemMenuItemsComponent implements OnInit {
  public scientificEcosystems: ScientificEcosystemPoster[] = [];
  public constructor(
    private langService: LangService,
    private scientificEcosystemService: ScientificEcosystemService,
  ) {}

  public ngOnInit(): void {
    this.scientificEcosystemService
      .fetchScientificEcosystemPosters()
      .then((response) => {
        this.scientificEcosystems = response.sort(
          (a, b) =>
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
        );
      });
  }

  public get isLoading() {
    return this.scientificEcosystemService
      .fetchAllScientificEcosystemSearchRecommendations;
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }
}
