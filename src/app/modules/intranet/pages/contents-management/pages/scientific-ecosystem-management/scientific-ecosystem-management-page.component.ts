import { Component, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { AnnouncementInfo } from '../../../../../../services/landing/announcements/announcement.interfaces';
import { AnnouncementService } from '../../../../../../services/landing/announcements/announcement.service';
import {
  ScientificEcosystemCreateInfo,
  ScientificEcosystemPoster,
} from '../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { CreateScientificEcosystemComponent } from './components/create-scientific-ecosystem/create-scientific-ecosystem.component';
import { ScientificEcosystemListComponent } from './components/scientific-ecosystem-list/scientific-ecosystem-list.component';
import labels from './scientific-ecosystem-management.lang';

@Component({
  standalone: true,
  templateUrl: './scientific-ecosystem-management-page.component.html',
  imports: [
    ScientificEcosystemListComponent,
    CreateScientificEcosystemComponent,
  ],
})
export class ScientificEcosystemManagementPage {
  public activeTabIndex: number = 0;
  @ViewChild('scientificEcosystemsLI')
  public scientificEcosystemsLI!: ElementRef<HTMLLIElement>;
  public scientificEcosystemToEdit: ScientificEcosystemPoster | undefined;
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
        this.scientificEcosystemsLI.nativeElement.click();
        this.activeTabIndex = 0;
      },
      error: (_err) => {
        this.toastService.error(labels.errorCreatingAnnouncement[this.lang]);
      },
    });
  }

  public submitScientificEcosystem(event: ScientificEcosystemCreateInfo) {}

  public handleCancelUpdate() {
    this.toastService.info(labels.updateCancelled[this.lang]);
    this.scientificEcosystemToEdit = undefined;
    this.changeActiveTab(0);
    this.scientificEcosystemsLI.nativeElement.click();
  }
}
