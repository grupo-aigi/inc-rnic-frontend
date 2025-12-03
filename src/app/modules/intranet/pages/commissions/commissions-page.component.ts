import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import labels from './commissions-page.language';
import { LangService } from '../../../../services/shared/lang/lang.service';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  templateUrl: './commissions-page.component.html',
  imports: [RouterModule],
})
export class CommissionsPage implements OnInit {
  public constructor(
    private title: Title,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.langService.language]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });
  }
}
