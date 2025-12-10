import { Component, Input } from '@angular/core';

import { ScientificEcosystemDetailGuidelines } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';

@Component({
  standalone: true,
  templateUrl: './scientific-ecosystem-guidelines.component.html',
  imports: [],
  selector: 'scientific-ecosystem-guidelines',
})
export class ScientificEcosystemGuidelinesComponent {
  @Input() section!: ScientificEcosystemDetailGuidelines;
}
