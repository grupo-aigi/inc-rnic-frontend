import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { ScientificEcosystemDetailResourceType } from './scientific-ecosystem.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ScientificEcosystemStateService {
  private activeSectionsSubject = new BehaviorSubject<
    ScientificEcosystemDetailResourceType[]
  >([
    'SCIENTIFIC_ECOSYSTEM__ABOUT_US',
    'SCIENTIFIC_ECOSYSTEM__GENERAL_OBJECTIVE',
    'SCIENTIFIC_ECOSYSTEM__SPECIFIC_OBJECTIVES',
  ]);

  public activeSections$: Observable<ScientificEcosystemDetailResourceType[]> =
    this.activeSectionsSubject.asObservable();

  public getActiveSections(): ScientificEcosystemDetailResourceType[] {
    return this.activeSectionsSubject.value;
  }

  public setActiveSections(
    sections: ScientificEcosystemDetailResourceType[],
  ): void {
    this.activeSectionsSubject.next(sections);
  }

  public toggleSection(
    sectionType: ScientificEcosystemDetailResourceType,
  ): void {
    const currentSections = this.activeSectionsSubject.value;

    if (currentSections.includes(sectionType)) {
      this.activeSectionsSubject.next(
        currentSections.filter((type) => type !== sectionType),
      );
    } else {
      this.activeSectionsSubject.next([...currentSections, sectionType]);
    }
  }

  public expandAll(allSections: ScientificEcosystemDetailResourceType[]): void {
    this.activeSectionsSubject.next([...allSections]);
  }

  public collapseAll(): void {
    this.activeSectionsSubject.next([]);
  }

  public isSectionActive(
    sectionType: ScientificEcosystemDetailResourceType,
  ): boolean {
    return this.activeSectionsSubject.value.includes(sectionType);
  }
}
