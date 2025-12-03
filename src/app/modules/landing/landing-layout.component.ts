import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AccessibilityPanelComponent } from './pages/shared/components/accessibility-panel/accessibility-panel.component';
import { FooterComponent } from './pages/shared/components/footer/footer.component';
import { NavBarComponent } from './pages/shared/components/navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-landing-layout-page',
  templateUrl: './landing-layout.component.html',
  imports: [
    RouterModule,
    NavBarComponent,
    FooterComponent,
    AccessibilityPanelComponent,
  ],
})
export class LandingLayoutPage {}
