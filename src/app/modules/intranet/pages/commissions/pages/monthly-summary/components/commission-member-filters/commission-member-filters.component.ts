import { Component, Input } from '@angular/core';

import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './commission-member-filters.lang';
import { TitleCasePipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-commission-member-filters',
  templateUrl: './commission-member-filters.component.html',
  imports: [TitleCasePipe],
})
export class CommissionMemberFiltersComponent {
  @Input() year!: number;
  @Input() month!: {
    id: number;
    en: string;
    es: string;
  };

  public constructor(private languageService: LangService) {}

  public get lang() {
    return this.languageService.language;
  }

  public get labels() {
    return labels;
  }

  public handleClickOnSearch(event: Event) {
    event.stopPropagation();
  }

  public handleSearch(event: Event) {
    event.stopPropagation();
  }
}
