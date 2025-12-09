import { Component } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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
export class LandingLayoutPage {
  marginForFooter = 0;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects ?? event.url;

        this.marginForFooter = url.includes('ecosistema') ? 300 : 0;
      });
  }
}
