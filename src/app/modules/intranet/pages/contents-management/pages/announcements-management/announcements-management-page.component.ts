
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { AnnouncementInfo } from '../../../../../../services/landing/announcements/announcement.interfaces';
import { AnnouncementService } from '../../../../../../services/landing/announcements/announcement.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './announcements-management.lang';
import { CreateAnnouncementComponent } from './components/create-announcement/create-announcement.component';
import { ListAnnouncementsComponent } from './components/list-announcements/list-announcements.component';

@Component({
  standalone: true,
  templateUrl: './announcements-management-page.component.html',
  imports: [
    ListAnnouncementsComponent,
    CreateAnnouncementComponent
],
})
export class AnnouncementsManagementPage {
  public activeTabIndex: number = 0;
  @ViewChild('announcementsLI')
  public announcementsLI!: ElementRef<HTMLLIElement>;

  public constructor(
    private title: Title,
    private langService: LangService,
    private toastService: ToastrService,
    private announcementService: AnnouncementService,
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

  public publishAnnouncement(announcement: AnnouncementInfo) {
    return this.announcementService.createAnnouncement(announcement).subscribe({
      next: (value) => {
        this.toastService.success(
          labels.announcementCreatedSuccessfully[this.lang],
        );
        this.announcementsLI.nativeElement.click();
        this.activeTabIndex = 0;
      },
      error: (_err) => {
        this.toastService.error(labels.errorCreatingAnnouncement[this.lang]);
      },
    });
  }
}
