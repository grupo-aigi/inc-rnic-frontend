import { Component, Input } from '@angular/core';

import { ScientificEcosystemDetailHowToParticipate } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';

@Component({
  standalone: true,
  templateUrl: './scientific-ecosystem-how-to-participate.component.html',
  imports: [],
  selector: 'scientific-ecosystem-how-to-participate',
})
export class ScientificEcosystemHowToParticipateComponent {
  @Input() section!: ScientificEcosystemDetailHowToParticipate;
}
