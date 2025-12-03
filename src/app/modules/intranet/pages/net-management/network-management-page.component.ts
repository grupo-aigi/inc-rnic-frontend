
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LangService } from '../../../../services/shared/lang/lang.service';
import { NetworkRegistrationsComponent } from './components/registrations/network-registrations.component';
import { NetworkRetirementsComponent } from './components/retirements/network-retirements.component';
import labels from './network-management-page.lang';

@Component({
  standalone: true,
  templateUrl: './network-management-page.component.html',
  imports: [
    NetworkRegistrationsComponent,
    NetworkRetirementsComponent
],
})
export class NetworkManagementPage implements OnInit {
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

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public changeActiveTab(index: number): void {
    this.activeTabIndex = index;
  }
}
