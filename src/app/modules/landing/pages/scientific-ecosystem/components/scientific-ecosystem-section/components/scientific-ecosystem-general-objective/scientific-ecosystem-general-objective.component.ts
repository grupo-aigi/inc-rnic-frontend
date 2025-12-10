import { JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ScientificEcosystemDetailGeneralObjective } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';

@Component({
  standalone: true,
  templateUrl: './scientific-ecosystem-general-objective.component.html',
  imports: [ReactiveFormsModule, JsonPipe],
  selector: 'scientific-ecosystem-general-objective',
})
export class ScientificEcosystemGeneralObjectiveComponent {
  @Input() section!: ScientificEcosystemDetailGeneralObjective;
}
