
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../../../../../services/auth/auth.service';
import { SidebarMode } from '../../../../../../../services/shared/layout/layout.interfaces';
import { LayoutService } from '../../../../../../../services/shared/layout/layout.service';
import { SidebarFullComponent } from '../sidebar-full/sidebar-full.component';
import { SidebarMediumComponent } from '../sidebar-medium/sidebar-medium.component';

@Component({
  standalone: true,
  selector: 'app-intranet-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [
    RouterLink,
    RouterLinkActive,
    SidebarFullComponent,
    SidebarMediumComponent
],
})
export class SidebarComponent implements OnInit {
  public currentSidebarMode: SidebarMode;

  public constructor(
    private layoutService: LayoutService,
    public authService: AuthService,
  ) {
    this.currentSidebarMode = this.layoutService.currSidebarMode;
  }

  public ngOnInit(): void {
    this.layoutService.sidebarMode$.subscribe({
      next: (sidebarMode) => {
        this.currentSidebarMode = sidebarMode;
      },
    });
  }
}
