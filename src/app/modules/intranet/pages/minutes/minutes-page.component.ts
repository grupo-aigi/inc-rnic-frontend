import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { LangService } from '../../../../services/shared/lang/lang.service';
import labels from './minutes-page.language';

@Component({
  standalone: true,
  templateUrl: './minutes-page.component.html',
  imports: [RouterModule],
})
export class MinutesPage implements OnInit {
  public constructor(
    private title: Title,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(this.labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(this.labels.pageTitle[lang]);
    });
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }
}
