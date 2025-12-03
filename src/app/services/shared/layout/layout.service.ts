import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SidebarWidth, SidebarMode } from './layout.interfaces';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  public isMobile: boolean = false;
  public isTablet: boolean = false;
  public isDesktop: boolean = false;

  public currSidebarMode: SidebarMode;
  private sub = new Subject<SidebarMode>();
  public sidebarMode$ = this.sub.asObservable();

  public constructor() {
    this.isMobile = window.innerWidth < 768;
    this.isTablet = window.innerWidth >= 768 && window.innerWidth < 1200;
    this.isDesktop = window.innerWidth >= 1200;
    if (this.isMobile) {
      this.currSidebarMode = 'COLLAPSED';
      this.sub.next('COLLAPSED');
      return;
    }
    if (this.isTablet) {
      this.currSidebarMode = 'MEDIUM';
      this.sub.next('MEDIUM');
      return;
    }
    const sidebarMode = sessionStorage.getItem('sidebar_mode') as SidebarMode;
    if (!sidebarMode) {
      sessionStorage.setItem('sidebar_mode', 'FULL');
      this.currSidebarMode = 'FULL';
      this.sub.next('FULL');
      return;
    }
    this.currSidebarMode = sidebarMode;
    this.sub.next(sidebarMode);
  }

  public changeSidebarMode(sidebarMode: SidebarMode) {
    sessionStorage.setItem('sidebar_mode', sidebarMode);
    this.currSidebarMode = sidebarMode;
    this.sub.next(sidebarMode);
  }

  public get sidebarWidth() {
    switch (this.currSidebarMode) {
      case 'FULL':
        return SidebarWidth.FULL;
      case 'MEDIUM':
        return SidebarWidth.MEDIUM;
      case 'COLLAPSED':
        return SidebarWidth.COLLAPSED;
      default:
        return SidebarWidth.FULL;
    }
  }
}
