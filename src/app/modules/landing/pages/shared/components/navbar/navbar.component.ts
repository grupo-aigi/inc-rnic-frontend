import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';

import { disable as disableDarkMode, isEnabled } from 'darkreader';

import { AppLanguage } from '../../../../../../services/shared/lang/lang.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { AuthOptionsPopupComponent } from './components/auth-options-popup/auth-options-popup.component';
import { GlobalSearchComponent } from './components/global-search/global-search.component';
import { MobileAccessibilityMenuComponent } from './components/mobile-accessibility-menu/mobile-accessibility-menu.component';
import { MobileRoutesComponent } from './components/mobile-routes/mobile-routes.component';
import labels from './navbar.lang';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [
    RouterModule,
    RouterLink,
    RouterLinkActive,
    GlobalSearchComponent,
    MobileRoutesComponent,
    AuthOptionsPopupComponent,
    MobileAccessibilityMenuComponent,
  ],
})
export class NavBarComponent implements OnInit {
  public appTheme: string = 'LIGHT';

  @ViewChild('userOptionsRef')
  public userOptionsRef!: ElementRef<HTMLDivElement>;

  @ViewChild('changeComponentRef')
  public changeComponentRef!: ElementRef<HTMLDivElement>;
  public displayUserOptionsPopup: boolean = false;
  public displayMenu: boolean = false;

  public constructor(
    private router: Router,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.displayMenu = false;
      }
    });
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public get theme() {
    return isEnabled() ? 'DARK' : 'LIGHT';
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

  public handleOpenLoginPopup() {
    this.displayUserOptionsPopup = true;
    // this.router.navigate([] /*{ fragment: 'login' }*/);
  }

  public handleStartRegisterProcess() {
    disableDarkMode();
    this.router.navigate(['/auth/lineamientos-red']);
  }

  public handleClosePopup() {
    this.displayUserOptionsPopup = false;
  }

  public handleToggleMenu() {
    this.displayMenu = !this.displayMenu;
  }
}
