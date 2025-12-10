import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ScientificEcosystemDetailProjects } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';

@Component({
  standalone: true,
  selector: 'app-scientific-ecosystem-projects',
  templateUrl: './scientific-ecosystem-projects.component.html',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
})
export class ScientificEcosystemProjectsComponent {
  @Input() section!: ScientificEcosystemDetailProjects;
}
