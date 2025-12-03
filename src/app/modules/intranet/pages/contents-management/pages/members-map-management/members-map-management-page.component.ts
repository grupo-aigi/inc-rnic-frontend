
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './members-map-management-page.language';
import { NationalPartnersManagementComponent } from './components/national/national-partners-management.component';
import { InternationalPartnersManagementComponent } from './components/international/international-partners-management.component';

@Component({
  standalone: true,
  templateUrl: './members-map-management-page.component.html',
  imports: [
    NationalPartnersManagementComponent,
    InternationalPartnersManagementComponent
],
})
export class MembersMapManagementPage {
  public activeTabIndex: number = 0;

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

  public changeActiveTab(index: number): void {
    this.activeTabIndex = index;
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }
}
