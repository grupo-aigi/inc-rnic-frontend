import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { LayoutService } from '../../services/shared/layout/layout.service';
import { AccessibilityPanelComponent } from '../landing/pages/shared/components/accessibility-panel/accessibility-panel.component';
import { FooterComponent } from './pages/shared/components/footer/footer.component';
import { NavBarComponent } from './pages/shared/components/navbar/navbar.component';
import { SidebarComponent } from './pages/shared/components/sidebars/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-intranet-layout-page',
  templateUrl: './intranet-layout.component.html',
  imports: [
    CommonModule,
    SidebarComponent,
    AccessibilityPanelComponent,
    RouterModule,
    NavBarComponent,
    FooterComponent,
  ],
})
export class IntranetLayoutPage {
  public loading: boolean = true;
  public innerWidth: number = window.innerWidth;

  public constructor(
    public authService: AuthService,
    private layoutService: LayoutService,
  ) {}

  public get currentTheme(): 'LIGHT' | 'DARK' {
    const theme = sessionStorage.getItem('theme') as 'LIGHT' | 'DARK';
    return theme || 'LIGHT';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }

  public get sidebarWidth() {
    const hideSidebar = window.innerWidth < 1200;
    if (hideSidebar) {
      return '0px';
    }
    return this.layoutService.sidebarWidth;
  }
}
