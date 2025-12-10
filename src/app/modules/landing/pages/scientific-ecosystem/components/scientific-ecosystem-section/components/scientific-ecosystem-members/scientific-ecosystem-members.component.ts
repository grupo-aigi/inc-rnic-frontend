import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ScientificEcosystemDetailMembers } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';

@Component({
  standalone: true,
  templateUrl: './scientific-ecosystem-members.component.html',
  imports: [ReactiveFormsModule],
  selector: 'app-scientific-ecosystem-members',
})
export class ScientificEcosystemMembersComponent {
  @Input() section!: ScientificEcosystemDetailMembers;

  public constructor(private resourcesService: ResourcesService) {}

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName(
      'scientific-ecosystems',
      name,
    );
  }
}
