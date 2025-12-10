import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import {
  ScientificEcosystemBaseInfo,
  ScientificEcosystemCreateInfo,
  ScientificEcosystemDetail,
  ScientificEcosystemDetailAboutUs,
  ScientificEcosystemDetailContact,
  ScientificEcosystemDetailGeneralObjective,
  ScientificEcosystemDetailGuidelines,
  ScientificEcosystemDetailHowToParticipate,
  ScientificEcosystemDetailMembers,
  ScientificEcosystemDetailProjects,
  ScientificEcosystemDetailRoadmap,
  ScientificEcosystemDetailSpecificObjectives,
  ScientificEcosystemPoster,
} from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { ScientificEcosystemService } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { SetScientificEcosystemAboutUsComponent } from './components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-about-us/app-set-scientific-ecosystem-about-us.component';
import { SetScientificEcosystemContactComponent } from './components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-contact/app-set-scientific-ecosystem-contact.component';
import { SetScientificEcosystemGeneralObjectiveComponent } from './components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-general-objective/app-set-scientific-ecosystem-general-objective.component';
import { SetScientificEcosystemGuidelinesComponent } from './components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-guidelines/app-set-scientific-ecosystem-guidelines.component';
import { SetScientificEcosystemHowToParticipateComponent } from './components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-how-to-participate/app-set-scientific-ecosystem-how-to-participate.component';
import { SetScientificEcosystemMembersComponent } from './components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-members/app-set-scientific-ecosystem-members.component';
import { SetScientificEcosystemProjectsComponent } from './components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-projects/app-set-scientific-ecosystem-projects.component';
import { SetScientificEcosystemRoadmapComponent } from './components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-roadmap/app-set-scientific-ecosystem-roadmap.component';
import { SetScientificEcosystemSpecificObjectivesComponent } from './components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-specific-objectives/app-set-scientific-ecosystem-specific-objectives.component';
import { CreateScientificEcosystemBaseInfoComponent } from './components/create-scientific-ecosystem-base-info/create-scientific-ecosystem-base-info.component';
import labels from './create-scientific-ecosystem.lang';

@Component({
  standalone: true,
  selector: 'app-create-scientific-ecosystem',
  templateUrl: './create-scientific-ecosystem.component.html',
  imports: [
    CommonModule,
    CreateScientificEcosystemBaseInfoComponent,
    SetScientificEcosystemAboutUsComponent,
    SetScientificEcosystemGeneralObjectiveComponent,
    SetScientificEcosystemSpecificObjectivesComponent,
    SetScientificEcosystemRoadmapComponent,
    SetScientificEcosystemGuidelinesComponent,
    SetScientificEcosystemHowToParticipateComponent,
    SetScientificEcosystemMembersComponent,
    SetScientificEcosystemProjectsComponent,
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
  handleUpdateGeneralObjective(
    $event: ScientificEcosystemDetailGeneralObjective,
  ) {
    throw new Error('Method not implemented.');
  }
  handleUpdateSpecificObjectives(
    $event: ScientificEcosystemDetailSpecificObjectives,
  ) {
    throw new Error('Method not implemented.');
  }
  handleUpdateRoadmap($event: ScientificEcosystemDetailRoadmap) {
    throw new Error('Method not implemented.');
  }
  handleUpdateGuidelines($event: ScientificEcosystemDetailGuidelines) {
    throw new Error('Method not implemented.');
  }

  handleUpdateHowToParticipate(
    $event: ScientificEcosystemDetailHowToParticipate,
  ) {
    throw new Error('Method not implemented.');
  }
  handleUpdateMembers($event: ScientificEcosystemDetailMembers) {
    throw new Error('Method not implemented.');
  }
  handleUpdateProjects($event: ScientificEcosystemDetailProjects) {
    throw new Error('Method not implemented.');
  }
  handleUpdateContact($event: ScientificEcosystemDetailContact) {
    throw new Error('Method not implemented.');
  }
}
