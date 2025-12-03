
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NewsTag } from '../../../../../../services/landing/news/news.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './current-event-tags.lang';
import { EventTag } from '../../../../../../services/landing/event/event.interfaces';

@Component({
  standalone: true,
  selector: 'app-current-event-tags',
  templateUrl: './current-event-tags.component.html',
  imports: [RouterLink],
})
export class CurrentEventTagsComponent implements OnInit {
  @Input() public tags: EventTag[] = [];
  public constructor(private langService: LangService) {}

  public ngOnInit(): void {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }
}
