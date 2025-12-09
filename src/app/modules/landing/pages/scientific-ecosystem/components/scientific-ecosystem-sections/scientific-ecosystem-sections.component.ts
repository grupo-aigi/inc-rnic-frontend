import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ScientificEcosystemSection } from '../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';
import labels from './scientific-ecosystem-sections.lang';

@Component({
  standalone: true,
  selector: 'app-scientific-ecosystem-sections',
  templateUrl: './scientific-ecosystem-sections.component.html',
  imports: [CommonModule],
})
export class ScientificEcosystemSectionsComponent {
  @Input() public sections!: ScientificEcosystemSection[];

  public activeSection: ScientificEcosystemSection | null = null;

  public constructor(
    private resourcesService: ResourcesService,
    private langService: LangService,
  ) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  handleToggleSection(sectionId: string) {
    if (this.activeSection?.id === sectionId) {
      this.activeSection = null;
    } else {
      const section = this.sections.find((sec) => sec.id === sectionId);
      if (section) {
        this.activeSection = section;
      }
    }
  }
}
