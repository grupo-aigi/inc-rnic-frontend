import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LangService } from '../../../../services/shared/lang/lang.service';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import labels from './home-page.lang';

@Component({
  standalone: true,
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  imports: [AnnouncementsComponent],
})
export class HomePage implements OnInit {
  public constructor(
    private title: Title,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }
}
