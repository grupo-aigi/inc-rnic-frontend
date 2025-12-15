import { CommonModule, JsonPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { ScientificEcosystemCreateService } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem-create.service';
import {
  SCIENTIFIC_ECOSYSTEM_SECTIONS_MAP,
  ScientificEcosystemBaseInfo,
  ScientificEcosystemDetailAboutUs,
  ScientificEcosystemDetailContact,
  ScientificEcosystemDetailGeneralObjective,
  ScientificEcosystemDetailGuidelines,
  ScientificEcosystemDetailHowToParticipate,
  ScientificEcosystemDetailMembers,
  ScientificEcosystemDetailProjects,
  ScientificEcosystemDetailResourceType,
  ScientificEcosystemDetailRoadmap,
  ScientificEcosystemDetailSpecificObjectives,
} from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { ChangeScientificEcosystemSectionsModalComponent } from './components/change-scientific-ecosystem-sections-modal/change-scientific-ecosystem-sections-modal.component';
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
    ChangeScientificEcosystemSectionsModalComponent,
    JsonPipe,
  ],
})
export class CreateScientificEcosystemComponent {
  @Output() private onSubmit: EventEmitter<void> = new EventEmitter();
  @Output() private onCancelUpdate: EventEmitter<void> = new EventEmitter();
  public activeTabIndex: number = 0;
  @ViewChild('allScientificEcosystemTabs')
  public allEventsTab!: ElementRef<HTMLLIElement>;
  public isEditing: boolean = false;

  public constructor(
    private router: Router,
    private toastService: ToastrService,
    private langService: LangService,
    private scientificEcosystemCreateService: ScientificEcosystemCreateService,
  ) {}

  public get baseInfo(): ScientificEcosystemBaseInfo | undefined {
    return this.scientificEcosystemCreateService.createInfo?.baseInfo;
  }

  public get createInfo() {
    return this.scientificEcosystemCreateService.createInfo;
  }

  public getSectionName(sectionType: ScientificEcosystemDetailResourceType) {
    return SCIENTIFIC_ECOSYSTEM_SECTIONS_MAP[sectionType];
  }

  public get sections() {
    return (this.createInfo?.detail.sections || []).filter(
      ({ TYPE }) => TYPE !== 'NOTICIAS' && TYPE !== 'EVENTOS',
    );
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

  public handleSetBaseInfo(baseInfo: ScientificEcosystemBaseInfo) {
    this.scientificEcosystemCreateService.setupAllSections(baseInfo.title);
  }

  public changeActiveTab(index: number) {
    this.activeTabIndex = index;
  }

  public handlePublishScientificEcosystem() {
    this.scientificEcosystemCreateService.publishEcosystem().subscribe({
      next: (value) => {
        this.toastService.success(
          labels.scientificEcosystemCreatedSuccessfully[this.lang],
        );
        this.onSubmit.emit();
      },
      error: (_err) => {
        this.toastService.error(
          this.labels.errorCreatingScientificEcosystem[this.lang],
        );
      },
    });
  }

  handleUpdateAboutUs($event: ScientificEcosystemDetailAboutUs) {
    this.scientificEcosystemCreateService.handleUpdateSection(
      'NOSOTROS',
      $event,
    );
  }
  handleUpdateGeneralObjective(
    $event: ScientificEcosystemDetailGeneralObjective,
  ) {
    this.scientificEcosystemCreateService.handleUpdateSection(
      'OBJ_GENERAL',
      $event,
    );
  }
  handleUpdateSpecificObjectives(
    $event: ScientificEcosystemDetailSpecificObjectives,
  ) {
    this.scientificEcosystemCreateService.handleUpdateSection(
      'OBJ_ESPECIFICOS',
      $event,
    );
  }
  handleUpdateRoadmap($event: ScientificEcosystemDetailRoadmap) {
    this.scientificEcosystemCreateService.handleUpdateSection(
      'HOJA_RUTA',
      $event,
    );
  }
  handleUpdateGuidelines($event: ScientificEcosystemDetailGuidelines) {
    this.scientificEcosystemCreateService.handleUpdateSection(
      'LINEAMIENTOS',
      $event,
    );
  }

  handleUpdateHowToParticipate(
    $event: ScientificEcosystemDetailHowToParticipate,
  ) {
    this.scientificEcosystemCreateService.handleUpdateSection(
      'COMO_PARTICIPAR',
      $event,
    );
  }
  handleUpdateMembers($event: ScientificEcosystemDetailMembers) {
    this.scientificEcosystemCreateService.handleUpdateSection(
      'INTEGRANTES',
      $event,
    );
  }
  handleUpdateProjects($event: ScientificEcosystemDetailProjects) {
    this.scientificEcosystemCreateService.handleUpdateSection(
      'PROYECTOS',
      $event,
    );
  }
  handleUpdateContact($event: ScientificEcosystemDetailContact) {
    this.scientificEcosystemCreateService.handleUpdateSection(
      'CONTACTO',
      $event,
    );
  }
}
