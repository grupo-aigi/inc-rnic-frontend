
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NewsTag } from '../../../../../../services/landing/news/news.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './current-news-tags.lang';

@Component({
  standalone: true,
  selector: 'app-current-news-tags',
  templateUrl: './current-news-tags.component.html',
  imports: [RouterLink],
})
export class CurrentNewsTagsComponent implements OnInit {
  @Input() public tags: NewsTag[] = [];
  public constructor(private langService: LangService) {}

  public ngOnInit(): void {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }
}
