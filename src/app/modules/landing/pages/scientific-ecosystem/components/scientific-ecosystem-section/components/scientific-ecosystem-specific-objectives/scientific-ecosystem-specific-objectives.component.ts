import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ScientificEcosystemDetailSpecificObjectives } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';

@Component({
  standalone: true,
  templateUrl: './scientific-ecosystem-specific-objectives.component.html',
  imports: [ReactiveFormsModule],
  selector: 'app-scientific-ecosystem-specific-objectives',
})
export class ScientificEcosystemSpecificObjectivesComponent {
  @Input() section!: ScientificEcosystemDetailSpecificObjectives;
}
