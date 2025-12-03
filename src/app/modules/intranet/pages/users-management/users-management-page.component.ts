
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LangService } from '../../../../services/shared/lang/lang.service';
import { AddUsersComponent } from './components/add-users/add-users.component';
import { UserListComponent } from './components/user-list/user-list.component';
import labels from './users-management-page.lang';

@Component({
  standalone: true,
  templateUrl: './users-management-page.component.html',
  imports: [UserListComponent, AddUsersComponent],
})
export class UsersManagementPage implements OnInit {
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
