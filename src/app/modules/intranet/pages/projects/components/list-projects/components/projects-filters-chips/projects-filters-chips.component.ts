
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { researchLines } from '../../../../../../../../services/intranet/projects/projects.data';
import {
  ProjectFilterCriteria,
  ResearchLine,
} from '../../../../../../../../services/intranet/projects/projects.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './projects-filters-chips.lang';

@Component({
  standalone: true,
  selector: 'app-projects-filters-chips',
  templateUrl: './projects-filters-chips.component.html',
  imports: [],
})
export class ProjectsFiltersChipsComponent implements OnInit {
  @Input() filterCriteria!: ProjectFilterCriteria;
  @Output() public onChange: EventEmitter<void> = new EventEmitter();

  public constructor(private langService: LangService) {}

  public ngOnInit(): void {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public get researchLines() {
    return researchLines;
  }

  public handleUpdateActiveResearchLine(researchLine: ResearchLine) {
    if (researchLine === this.filterCriteria.linea) {
      return;
    }
    this.filterCriteria.linea = researchLine;
    this.onChange.emit();
  }
}
