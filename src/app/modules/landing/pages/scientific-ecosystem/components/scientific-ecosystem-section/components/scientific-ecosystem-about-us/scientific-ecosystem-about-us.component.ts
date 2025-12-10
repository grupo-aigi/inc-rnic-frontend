import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ScientificEcosystemDetailAboutUs } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';

@Component({
  standalone: true,
  templateUrl: './scientific-ecosystem-about-us.component.html',
  selector: 'app-scientific-ecosystem-about-us',
  imports: [ReactiveFormsModule],
})
export class ScientificEcosystemAboutUsComponent {
  @Input() section!: ScientificEcosystemDetailAboutUs;
}
