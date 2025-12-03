
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ReplaceUnderscoresPipe } from '../../../../../../../../pipes/replace-underscore.pipe';
import {
  ProjectFilterCriteria,
  ResearchLine,
} from '../../../../../../../../services/intranet/projects/projects.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './projects-filters-reset.lang';
import { researchLines } from '../../../../../../../../services/intranet/projects/projects.data';

@Component({
  standalone: true,
  selector: 'app-projects-filters-reset',
  templateUrl: './projects-filters-reset.component.html',
  imports: [ReplaceUnderscoresPipe],
})
export class ProjectsFiltersResetComponent implements OnInit {
  @Input() public filterCriteria!: ProjectFilterCriteria;
  @Input() public displayResetFiltersButton!: boolean;
  @Output() public onReset: EventEmitter<void> = new EventEmitter();

  public constructor(private langService: LangService) {}

  public ngOnInit(): void {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public handleResetFilters(event: MouseEvent): void {
    event.preventDefault();
    this.onReset.emit();
  }

  public get researchLines() {
    return researchLines;
  }

  public getResearchLineName(line: ResearchLine): string {
    return researchLines.find((r) => r.value === line)?.name[this.lang] || '';
  }
}
