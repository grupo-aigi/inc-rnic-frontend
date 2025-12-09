import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { ResourceContent } from '../../../../../../../../services/shared/contents/contents.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { CreateResourceContentType1Component } from '../../../shared/create-resource-content-type1/create-resource-content-type1.component';
import { CreateResourceContentType10Component } from '../../../shared/create-resource-content-type10/create-resource-content-type10.component';
import { CreateResourceContentType11Component } from '../../../shared/create-resource-content-type11/create-resource-content-type11.component';
import { CreateResourceContentType12Component } from '../../../shared/create-resource-content-type12/create-resource-content-type12.component';
import { CreateResourceContentType13Component } from '../../../shared/create-resource-content-type13/create-resource-content-type13.component';
import { CreateResourceContentType14Component } from '../../../shared/create-resource-content-type14/create-resource-content-type14.component';
import { CreateResourceContentType2Component } from '../../../shared/create-resource-content-type2/create-resource-content-type2.component';
import { CreateResourceContentType3Component } from '../../../shared/create-resource-content-type3/create-resource-content-type3.component';
import { CreateResourceContentType4Component } from '../../../shared/create-resource-content-type4/create-resource-content-type4.component';
import { CreateResourceContentType5Component } from '../../../shared/create-resource-content-type5/create-resource-content-type5.component';
import { CreateResourceContentType6Component } from '../../../shared/create-resource-content-type6/create-resource-content-type6.component';
import { CreateResourceContentType7Component } from '../../../shared/create-resource-content-type7/create-resource-content-type7.component';
import { CreateResourceContentType8Component } from '../../../shared/create-resource-content-type8/create-resource-content-type8.component';
import { CreateResourceContentType9Component } from '../../../shared/create-resource-content-type9/create-resource-content-type9.component';
import { CreateScientificEcosystemBaseInfoComponent } from './components/create-scientific-ecosystem-base-info/create-scientific-ecosystem-base-info.component';
import labels from './create-scientific-ecosystem.lang';
import {
  ScientificEcosystemBaseInfo,
  ScientificEcosystemBaseInfoBody,
  ScientificEcosystemCreateInfo,
  ScientificEcosystemDetail,
  ScientificEcosystemDetailAboutUs,
  ScientificEcosystemPoster,
} from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { ScientificEcosystemService } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.service';
import { SetScientificEcosystemAboutUsComponent } from './components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-about-us/app-set-scientific-ecosystem-about-us.component';
import { SetScientificEcosystemGeneralObjectiveComponent } from './components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-general-objective/app-set-scientific-ecosystem-general-objective.component';
import { SetScientificEcosystemContactComponent } from './components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-contact/app-set-scientific-ecosystem-contact.component';
import { SetScientificEcosystemGuidelinesComponent } from './components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-guidelines/app-set-scientific-ecosystem-guidelines.component';
import { SetScientificEcosystemHowToParticipateComponent } from './components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-how-to-participate/app-set-scientific-ecosystem-how-to-participate.component';
import { SetScientificEcosystemMembersComponent } from './components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-members/app-set-scientific-ecosystem-members.component';
import { SetScientificEcosystemProjectsComponent } from './components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-projects/app-set-scientific-ecosystem-projects.component';
import { SetScientificEcosystemRoadmapComponent } from './components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-roadmap/app-set-scientific-ecosystem-roadmap.component';
import { SetScientificEcosystemSpecificObjectivesComponent } from './components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-specific-objectives/app-set-scientific-ecosystem-specific-objectives.component';
import { SetScientificEcosystemEventsComponent } from './components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-events/app-set-scientific-ecosystem-events.component';

@Component({
  standalone: true,
  selector: 'app-create-scientific-ecosystem',
  templateUrl: './create-scientific-ecosystem.component.html',
  imports: [
    CreateScientificEcosystemBaseInfoComponent,
    SetScientificEcosystemAboutUsComponent,
    SetScientificEcosystemGeneralObjectiveComponent,
    SetScientificEcosystemSpecificObjectivesComponent,
    SetScientificEcosystemRoadmapComponent,
    SetScientificEcosystemGuidelinesComponent,
    SetScientificEcosystemHowToParticipateComponent,
    SetScientificEcosystemMembersComponent,
    SetScientificEcosystemProjectsComponent,
    SetScientificEcosystemEventsComponent,
    SetScientificEcosystemContactComponent,
  ],
})
export class CreateScientificEcosystemComponent implements OnInit {
  @Input() public scientificEcosystemToEdit:
    | ScientificEcosystemPoster
    | undefined;
  @Output() private onSubmit: EventEmitter<ScientificEcosystemCreateInfo> =
    new EventEmitter();
  @Output() private onCancelUpdate: EventEmitter<void> = new EventEmitter();
  public detail: ScientificEcosystemDetail | null = null;
  public baseInfo: ScientificEcosystemBaseInfo | undefined;
  public activeTabIndex: number = 0;
  resources: any;
  eventUrlNameToEdit: any;

  public constructor(
    private router: Router,
    private scientificEcosystemService: ScientificEcosystemService,
    private toastService: ToastrService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    if (!this.scientificEcosystemToEdit) return;
    const { title } = this.scientificEcosystemToEdit;

    this.scientificEcosystemService
      .fetchScientificEcosystemDetail(this.scientificEcosystemToEdit.urlName)
      .subscribe((response) => {
        this.baseInfo = { title };
        this.detail = response;
      });
  }

  public handleCancelUpdate() {
    this.onCancelUpdate.emit();
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleClickOnTab() {
    // Navigate to the same view and Remove the fragment
    this.router.navigate([]);
  }

  public handleAddResource() {}

  public handleSetBaseInfo(baseInfo: ScientificEcosystemBaseInfo) {
    this.baseInfo = baseInfo;
  }

  public changeActiveTab(index: number) {
    this.activeTabIndex = index;
  }

  public handlePublishScientificEcosystem() {
    if (!this.baseInfo) return;

    // const scientificEcosystemBaseInfo: ScientificEcosystemBaseInfoBody = {
    //   ...this.baseInfo,
    // };
    // this.onSubmit.emit({
    //   baseInfo: scientificEcosystemBaseInfo,
    //   detail: this.detail as ScientificEcosystemDetail,
    // });
  }

  handleUpdateAboutUs($event: ScientificEcosystemDetailAboutUs) {
    throw new Error('Method not implemented.');
  }
  handleUpdateGeneralObjective($event: ScientificEcosystemDetailAboutUs) {
    throw new Error('Method not implemented.');
  }
  handleUpdateSpecificObjectives($event: ScientificEcosystemDetailAboutUs) {
    throw new Error('Method not implemented.');
  }
  handleUpdateRoadmap($event: Event) {
    throw new Error('Method not implemented.');
  }
  handleUpdateGuidelines($event: Event) {
    throw new Error('Method not implemented.');
  }
  handleUpdateHowToParticipate($event: Event) {
    throw new Error('Method not implemented.');
  }
  handleUpdateMembers($event: Event) {
    throw new Error('Method not implemented.');
  }
  handleUpdateProjects($event: Event) {
    throw new Error('Method not implemented.');
  }
  handleUpdateEvents($event: Event) {
    throw new Error('Method not implemented.');
  }
  handleUpdateContact($event: Event) {
    throw new Error('Method not implemented.');
  }
}
