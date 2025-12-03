
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { formatDate } from '../../../../../../../helpers/date-formatters';
import { PublicationInfo } from '../../../../../../../services/landing/publications/publications.interfaces';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../services/shared/resources/resource.service';
import labels from './publication-item.lang';

@Component({
  standalone: true,
  selector: 'app-publication-item',
  templateUrl: './publication-item.component.html',
  imports: [RouterLink],
})
export class PublicationItemComponent {
  @Input() public publication!: PublicationInfo;
  @Input() public first!: boolean;
  @Input() public variant!: 'PUBLIC' | 'INTRANET';

  public constructor(
    private resourcesService: ResourcesService,
    private langService: LangService,
  ) {}

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('publications', name);
  }

  public formatDate(date: Date): string {
    return formatDate(date);
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }
}
