import { Component, Input } from '@angular/core';


import { ProjectsSearchRecommendation } from '../../../../../../../../services/intranet/projects/projects.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './projects-filters-recommendations.lang';

@Component({
  standalone: true,
  selector: 'app-projects-filters-recommendations',
  templateUrl: './projects-filters-recommendations.component.html',
  imports: [],
})
export class ProjectsFiltersRecommendationsComponent {
  @Input()
  public recommendedOptions: ProjectsSearchRecommendation[] = [];

  public constructor(private langService: LangService) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }
}
