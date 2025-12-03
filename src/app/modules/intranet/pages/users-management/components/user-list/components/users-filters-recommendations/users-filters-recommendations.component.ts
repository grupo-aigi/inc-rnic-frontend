import { Component, Input } from '@angular/core';


import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './users-filters-recommendations.lang';
import { UsersSearchRecommendation } from '../../../../../../../../services/intranet/user/user.interfaces';

@Component({
  standalone: true,
  selector: 'app-users-filters-recommendations',
  templateUrl: './users-filters-recommendations.component.html',
  imports: [],
})
export class UsersFiltersRecommendationsComponent {
  @Input()
  public recommendedOptions: UsersSearchRecommendation[] = [];

  public constructor(private langService: LangService) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }
}
