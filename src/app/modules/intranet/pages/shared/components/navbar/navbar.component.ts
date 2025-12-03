import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { isEnabled } from 'darkreader';

import { AuthService } from '../../../../../../services/auth/auth.service';
import { AppLanguage } from '../../../../../../services/shared/lang/lang.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { SidebarMode } from '../../../../../../services/shared/layout/layout.interfaces';
import { LayoutService } from '../../../../../../services/shared/layout/layout.service';
import { MobileAccessibilityMenuComponent } from '../../../../../landing/pages/shared/components/navbar/components/mobile-accessibility-menu/mobile-accessibility-menu.component';
import { ChangeRolePopupComponent } from './components/change-role-popup/change-role-popup.component';
import { GlobalSearchComponent } from './components/global-search/global-search.component';
import { MobileRoutesComponent } from './components/mobile-routes/mobile-routes.component';
import { UserOptionsPopupComponent } from './components/user-options-popup/user-options-popup.component';
import labels from './navbar.lang';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [
    RouterLink,
    CommonModule,
    MobileRoutesComponent,
    ChangeRolePopupComponent,
    UserOptionsPopupComponent,
    GlobalSearchComponent,
    MobileAccessibilityMenuComponent,
  ],
})
export class NavBarComponent implements OnInit {
  public loadingUserInfo: boolean = true;
  public appTheme: string = 'LIGHT';
  @ViewChild('logoutRef')
  public logoutRef!: ElementRef<HTMLDivElement>;
  @ViewChild('changeRole')
  public changeRoleRef!: ElementRef<HTMLDivElement>;
  @ViewChild('changeRoleMobile')
  public changeRoleMobileRef!: ElementRef<HTMLDivElement>;
  @ViewChild('logoutMobileRef')
  public loginMobileRef!: ElementRef<HTMLDivElement>;
  public displayUserOptionsPopup: boolean = false;
  public displayChangeRolePopup: boolean = false;
  public displayMenu: boolean = false;

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private langService: LangService,
    private layoutService: LayoutService,
  ) {}

  public get labels() {
    return labels;
  }

  public get userInfo() {
    return this.authService.userInfo;
  }

  public get activeRole() {
    return this.authService.activeRole;
  }

  public get lang() {
    return this.langService.language;
  }

  public get theme() {
    return isEnabled() ? 'DARK' : 'LIGHT';
  }

  public handleToggleMenu() {
    this.displayMenu = !this.displayMenu;
  }

  public ngOnInit(): void {
    this.route.fragment.subscribe((value) => {
      if (value === 'user-options') {
        this.displayUserOptionsPopup = true;
      }
      if (value === 'change-role') {
        this.displayChangeRolePopup = true;
      }
    });
    this.loadingUserInfo = false;
  }

  public handleChangeAppLanguage(lang: 'es' | 'en') {
    if (lang === 'en') {
      return (this.langService.changeLanguage = AppLanguage.ENGLISH);
    } else if (lang === 'es') {
      return (this.langService.changeLanguage = AppLanguage.SPANISH);
    } else {
      throw new Error('No language was selected');
    }
  }

  public get isNotFullSidebar() {
    return this.layoutService.currSidebarMode !== 'FULL';
  }

  public handleToggleSidebarType() {
    const currentSidebarMode = this.layoutService.currSidebarMode;
    let newSidebarMode: SidebarMode;
    if (currentSidebarMode === 'FULL') {
      newSidebarMode = 'MEDIUM';
    } else if (currentSidebarMode === 'MEDIUM') {
      newSidebarMode = 'COLLAPSED';
    } else if (currentSidebarMode === 'COLLAPSED') {
      newSidebarMode = 'FULL';
    } else {
      throw new Error('Invalid sidebar mode');
    }
    return this.layoutService.changeSidebarMode(newSidebarMode);
  }

  public handleOpenLoginPopup() {
    this.displayUserOptionsPopup = true;
    this.router.navigate([], { fragment: 'user-options' });
  }

  public handleToggleChangeRolePopup() {
    this.displayChangeRolePopup = !this.displayChangeRolePopup;
    if (this.displayChangeRolePopup) {
      this.router.navigate([], { fragment: 'change-role' });
    } else {
      this.router.navigate([], { fragment: undefined });
    }
  }

  public handleRegister() {
    this.router.navigate(['/auth/register']);
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: HTMLElement) {
    const clickedInsideLoginPopup =
      this.logoutRef?.nativeElement?.contains(targetElement as Node) ||
      this.loginMobileRef?.nativeElement?.contains(targetElement as Node);

    const clickedInsideChangeRolePopup =
      this.changeRoleRef?.nativeElement.contains(targetElement) ||
      this.changeRoleMobileRef?.nativeElement?.contains(targetElement as Node);

    if (!clickedInsideLoginPopup) {
      this.displayUserOptionsPopup = false;
      // this.router.navigate([], { fragment: undefined });
    }
    if (!clickedInsideChangeRolePopup) {
      this.displayChangeRolePopup = false;
      // this.router.navigate([], { fragment: undefined });
    }
  }
}
