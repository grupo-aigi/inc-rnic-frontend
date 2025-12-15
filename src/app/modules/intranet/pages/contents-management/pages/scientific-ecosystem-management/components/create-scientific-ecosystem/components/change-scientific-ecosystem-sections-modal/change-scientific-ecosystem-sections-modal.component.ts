import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ScientificEcosystemCreateService } from '../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem-create.service';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import labels from './change-scientific-ecosystem-sections-modal.lang';
import {
  SCIENTIFIC_ECOSYSTEM_SECTIONS_MAP,
  ScientificEcosystemDetailResourceType,
  ScientificEcosystemDetailType,
} from '../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';

@Component({
  standalone: true,
  selector: 'app-change-scientific-ecosystem-sections-modal',
  templateUrl: './change-scientific-ecosystem-sections-modal.component.html',
  imports: [],
})
export class ChangeScientificEcosystemSectionsModalComponent implements OnInit {
  @ViewChild('closeModalBtn')
  public closeModalBtn!: ElementRef<HTMLButtonElement>;

  public constructor(
    private langService: LangService,
    private scientificEcosystemCreateService: ScientificEcosystemCreateService,
  ) {}

  public get sections() {
    return (
      this.scientificEcosystemCreateService.createInfo?.detail.sections || []
    );
  }

  public ngOnInit() {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public getSectionName(sectionType: ScientificEcosystemDetailResourceType) {
    return SCIENTIFIC_ECOSYSTEM_SECTIONS_MAP[sectionType];
  }

  public moveUp(index: number): void {
    if (index === 0) return;
    this.swapSections(index, index - 1);
  }

  public moveDown(index: number): void {
    if (index === this.sections.length - 1) return;
    this.swapSections(index, index + 1);
  }

  private swapSections(indexA: number, indexB: number): void {
    const createInfo = this.scientificEcosystemCreateService.createInfo;
    if (!createInfo?.detail.sections) return;

    const sections = [...createInfo.detail.sections];
    [sections[indexA], sections[indexB]] = [sections[indexB], sections[indexA]];

    createInfo.detail.sections = sections;
  }

  public saveOrder(): void {
    // El orden ya está guardado en el servicio gracias a swapSections
    // Solo cerramos el modal
    this.closeModalBtn.nativeElement.click();
  }
}
