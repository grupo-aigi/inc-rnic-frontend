import { Component, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { PartnersService } from '../../../../../../services/landing/partners/partners.service';
import labels from './facilitators-management-page.lang';
import { CreateFacilitatorComponent } from './components/create-facilitator/create-facilitator.component';
import { ListFacilitatorsComponent } from './components/list-facilitators/list-facilitators.component';

import { NetworkParticipantInfo } from '../../../../../../services/landing/partners/partners.interfaces';

@Component({
  standalone: true,
  templateUrl: './facilitators-management-page.component.html',
  imports: [CreateFacilitatorComponent, ListFacilitatorsComponent],
})
export class FacilitatorsGroupManagementPage {
  public activeTabIndex: number = 0;
  @ViewChild('listFacilitatorsTab')
  public listFacilitatorsTab!: ElementRef<HTMLLIElement>;
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
        this.listFacilitatorsTab.nativeElement.click();
        this.activeTabIndex = 0;
        this.toastService.success(
          'Se ha creado el participante de La Red exitosamente',
          "Puede ver el participante en la sección 'miembros de La Red'",
        );
      });
  }
}
