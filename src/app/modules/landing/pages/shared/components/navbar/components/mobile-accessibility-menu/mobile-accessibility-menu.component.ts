import { Component } from '@angular/core';
import { AccessibilityService } from '../../../../../../../../services/shared/accessibility/accessibility.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { ThemeService } from '../../../../../../../../services/shared/theme/theme.service';

import {
  disable as disableDarkMode,
  enable as enableDarkMode,
  setFetchMethod,
} from 'darkreader';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-mobile-accessibility-menu',
  templateUrl: './mobile-accessibility-menu.component.html',
  imports: [CommonModule],
})
export class MobileAccessibilityMenuComponent {
  public constructor(
    private langService: LangService,
    private accessibilityService: AccessibilityService,
    private themeService: ThemeService,
  ) {}

  public toggleTheme() {
    setFetchMethod(window.fetch);
    if (this.themeService.currentTheme === 'LIGHT') {
      try {
        enableDarkMode({
          brightness: 100,
          contrast: 90,
          sepia: 10,
        });
        this.themeService.currentTheme = 'DARK';
      } catch (error) {
        console.error('Failed to enable dark mode', error);
        return;
      }
      return;
    }

    try {
      disableDarkMode();
      this.themeService.currentTheme = 'LIGHT';
    } catch (error) {
      console.error('Failed to disable dark mode', error);
    }
  }

  public get theme() {
    return this.themeService.currentTheme;
  }

  public get fontScale() {
    return this.accessibilityService.fontScale;
  }

  public handleIncrementFontSize() {
    this.accessibilityService.incrementFontSize();
  }

  public handleDecrementFontSize() {
    this.accessibilityService.decrementFontSize();
  }
}
