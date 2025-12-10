import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';

import {
  ScientificEcosystemDetailAboutUs,
  ScientificEcosystemDetailContact,
  ScientificEcosystemDetailGeneralObjective,
  ScientificEcosystemDetailGuidelines,
  ScientificEcosystemDetailHowToParticipate,
  ScientificEcosystemDetailMembers,
  ScientificEcosystemDetailProjects,
  ScientificEcosystemDetailRoadmap,
  ScientificEcosystemDetailSpecificObjectives,
  ScientificEcosystemDetailType,
} from '../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { SidebarOption } from '../../../../../../services/shared/layout/layout.interfaces';
import { SetScientificEcosystemAboutUsComponent } from '../../../../../intranet/pages/contents-management/pages/scientific-ecosystem-management/components/create-scientific-ecosystem/components/create-scientific-ecosystem-base-info/components/app-set-scientific-ecosystem-about-us/app-set-scientific-ecosystem-about-us.component';
import { ScientificEcosystemAboutUsComponent } from './components/scientific-ecosystem-about-us/scientific-ecosystem-about-us.component';
import { ScientificEcosystemContactComponent } from './components/scientific-ecosystem-contact/scientific-ecosystem-contact.component';
import { ScientificEcosystemGeneralObjectiveComponent } from './components/scientific-ecosystem-general-objective/scientific-ecosystem-general-objective.component';
import { ScientificEcosystemGuidelinesComponent } from './components/scientific-ecosystem-guidelines/scientific-ecosystem-guidelines.component';
import { ScientificEcosystemHowToParticipateComponent } from './components/scientific-ecosystem-how-to-participate/scientific-ecosystem-how-to-participate.component';
import { ScientificEcosystemMembersComponent } from './components/scientific-ecosystem-members/scientific-ecosystem-members.component';
import { ScientificEcosystemProjectsComponent } from './components/scientific-ecosystem-projects/scientific-ecosystem-projects.component';
import { ScientificEcosystemRoadmapComponent } from './components/scientific-ecosystem-roadmap/scientific-ecosystem-roadmap.component';
import { ScientificEcosystemSpecificObjectivesComponent } from './components/scientific-ecosystem-specific-objectives/scientific-ecosystem-specific-objectives.component';
import labels from './scientific-ecosystem-section.lang';

@Component({
  standalone: true,
  selector: 'app-scientific-ecosystem-section',
  templateUrl: './scientific-ecosystem-section.component.html',
  imports: [
    RouterLink,
    RouterModule,
    RouterLinkActive,
    CommonModule,
    ScientificEcosystemAboutUsComponent,
    ScientificEcosystemContactComponent,
    ScientificEcosystemGeneralObjectiveComponent,
    ScientificEcosystemGuidelinesComponent,
    ScientificEcosystemHowToParticipateComponent,
    ScientificEcosystemMembersComponent,
    ScientificEcosystemProjectsComponent,
    ScientificEcosystemRoadmapComponent,
    ScientificEcosystemSpecificObjectivesComponent,
    SetScientificEcosystemAboutUsComponent,
  ],
})
export class ScientificEcosystemSectionComponent {
  @Input() section!: ScientificEcosystemDetailType;

  public constructor(
    private router: Router,
    private langService: LangService,
  ) {}

  public get parsedToAboutUs() {
    return this.section as ScientificEcosystemDetailAboutUs;
  }

  public get parsedToGeneralObjective() {
    return this.section as ScientificEcosystemDetailGeneralObjective;
  }
  public get parsedToSpecificObjectives() {
    return this.section as ScientificEcosystemDetailSpecificObjectives;
  }
  public get parsedToRoadmap() {
    return this.section as ScientificEcosystemDetailRoadmap;
  }
  public get parsedToGuidelines() {
    return this.section as ScientificEcosystemDetailGuidelines;
  }
  public get parsedToHowToParticipate() {
    return this.section as ScientificEcosystemDetailHowToParticipate;
  }
  public get parsedToMembers() {
    return this.section as ScientificEcosystemDetailMembers;
  }
  public get parsedToProjects() {
    return this.section as ScientificEcosystemDetailProjects;
  }
  public get parsedToContact() {
    return this.section as ScientificEcosystemDetailContact;
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public handleToggle(option: SidebarOption) {
    option.open = !option.open;
  }
}
