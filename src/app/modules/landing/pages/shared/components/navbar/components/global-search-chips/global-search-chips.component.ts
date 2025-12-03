
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SearchSection } from '../../../../../../../../services/shared/global-search/global-search.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './global-search-chips.lang';

@Component({
  standalone: true,
  selector: 'app-global-landing-search-chips',
  templateUrl: './global-search-chips.component.html',
  imports: [],
})
export class GlobalSearchChipsComponent implements OnInit {
  @Input() public searchSections: SearchSection[] = [];
  @Output() public onChange: EventEmitter<void> = new EventEmitter();
  public hasEnabledSections = true;
  public allSectionsShown = true;

  public constructor(private langService: LangService) {}

  public ngOnInit(): void {
    this.recalculateEnabledSections();
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public handleDisableSection(event: MouseEvent, id: number) {
    event.stopPropagation();
    event.preventDefault();
    this.searchSections = this.searchSections.map((section) => {
      if (section.id === id) {
        section.enabled = false;
      }
      return section;
    });
    this.recalculateEnabledSections();
    this.onChange.emit();
  }
  public handleEnableSection(event: MouseEvent, id: number) {
    event.stopPropagation();
    event.preventDefault();
    this.searchSections = this.searchSections.map((section) => {
      if (section.id === id) {
        section.enabled = true;
      }
      return section;
    });
    this.recalculateEnabledSections();
    this.onChange.emit();
  }

  private recalculateEnabledSections() {
    this.allSectionsShown = this.searchSections.every(
      (section) => section.enabled,
    );
    this.hasEnabledSections = this.searchSections.some(
      (section) => section.enabled,
    );
  }
}
