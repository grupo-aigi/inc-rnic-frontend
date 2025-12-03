import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { formatDate } from '../../../../../../../../helpers/date-formatters';
import { NCPInfo } from '../../../../../../../../services/landing/ncp/ncp.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './current-scientific-ecosystem.lang';

@Component({
  standalone: true,
  selector: 'app-current-scientific-ecosystem',
  templateUrl: './current-scientific-ecosystem.component.html',
})
export class CurrentScientificEcosystemComponent {
  @Input() public scientificEcosystemInfo: NCPInfo | undefined;
  public loading: boolean = false;

  public constructor(
    private title: Title,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.title[this.lang]);
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public formatDate(updatedAt: Date) {
    return formatDate(updatedAt);
  }
}
