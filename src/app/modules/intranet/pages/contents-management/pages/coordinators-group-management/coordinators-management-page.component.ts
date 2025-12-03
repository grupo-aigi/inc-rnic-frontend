import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';


import { ToastrService } from 'ngx-toastr';

import { NetworkParticipantInfo } from '../../../../../../services/landing/partners/partners.interfaces';
import { PartnersService } from '../../../../../../services/landing/partners/partners.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { CreateCoordinatorComponent } from './components/create-coordinator/create-coordinator.component';
import { ListCoordinatorsComponent } from './components/list-coordinators/list-coordinators.component';
import labels from './coordinators-management-page.lang';

@Component({
  standalone: true,
  templateUrl: './coordinators-management-page.component.html',
  imports: [
    ListCoordinatorsComponent,
    CreateCoordinatorComponent
],
})
export class CoordinatorsGroupManagementPage implements OnInit {
  public activeTabIndex: number = 0;

  public constructor(
    private title: Title,
    private partnersService: PartnersService,
    private toastService: ToastrService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public changeActiveTab(index: number): void {
    this.activeTabIndex = index;
  }

  public createNetworkParticipant(
    networkParticipantInfo: NetworkParticipantInfo,
  ) {
    return this.partnersService
      .createNetworkParticipant(networkParticipantInfo)
      .subscribe(() => {
        this.toastService.success(
          labels.coordinatorCreatedSuccessfully[this.lang],
        );
      });
  }
}
