import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ScientificEcosystemDetailMembers } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';

@Component({
  standalone: true,
  templateUrl: './scientific-ecosystem-members.component.html',
  imports: [ReactiveFormsModule],
  selector: 'scientific-ecosystem-members',
})
export class ScientificEcosystemMembersComponent {
  @Input() section!: ScientificEcosystemDetailMembers;
}
