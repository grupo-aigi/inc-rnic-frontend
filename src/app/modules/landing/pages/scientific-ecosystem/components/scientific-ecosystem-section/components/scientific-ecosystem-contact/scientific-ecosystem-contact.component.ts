import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ScientificEcosystemDetailContact } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';

@Component({
  standalone: true,
  selector: 'app-scientific-ecosystem-contact',
  templateUrl: './scientific-ecosystem-contact.component.html',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
})
export class ScientificEcosystemContactComponent {
  @Input() section!: ScientificEcosystemDetailContact;
}
