import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './mobile-routes.lang';
import { ScientificEcosystemService } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.service';
import { ScientificEcosystemPoster } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';

@Component({
  standalone: true,
  selector: 'app-mobile-routes',
  templateUrl: './mobile-routes.component.html',
  imports: [RouterLink, RouterLinkActive],
})
export class MobileRoutesComponent implements OnInit {
  @Output() public onNavigate: EventEmitter<void> = new EventEmitter<void>();
  public activeSection: 'ABOUT' | 'MEMBERS' | 'OTHERS' | 'ECOSYSTEMS' | '' = '';
  public scientificEcosystems: ScientificEcosystemPoster[] = [];

  public constructor(
    private langService: LangService,
    private scientificEcosystemsService: ScientificEcosystemService,
  ) {}

  public ngOnInit(): void {
    this.scientificEcosystemsService
      .fetchScientificEcosystemPosters()
      .then((response) => {
        this.scientificEcosystems = response.sort(
          (a, b) =>
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
        );
      });
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleCloseTopBar() {
    this.onNavigate.emit();
  }

  public handleSetActiveSection(
    activeSection: 'ABOUT' | 'MEMBERS' | 'OTHERS' | 'ECOSYSTEMS',
  ) {
    if (this.activeSection === activeSection) {
      this.activeSection = '';
      return;
    }
    this.activeSection = activeSection;
  }
}
