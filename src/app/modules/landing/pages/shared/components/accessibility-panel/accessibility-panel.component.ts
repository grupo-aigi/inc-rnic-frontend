import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';

import {
  disable as disableDarkMode,
  enable as enableDarkMode,
  setFetchMethod,
} from 'darkreader';
import tippy from 'tippy.js';

import { AccessibilityService } from '../../../../../../services/shared/accessibility/accessibility.service';
import { AppLanguage } from '../../../../../../services/shared/lang/lang.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { ThemeService } from '../../../../../../services/shared/theme/theme.service';
import labels from './accessibility-panel.lang';

@Component({
  standalone: true,
  selector: 'app-accessibility-panel',
  templateUrl: './accessibility-panel.component.html',
  imports: [CommonModule],
})
export class AccessibilityPanelComponent implements AfterViewInit {
  public constructor(
    private langService: LangService,
    private accessibilityService: AccessibilityService,
    private themeService: ThemeService,
  ) {}

  public ngAfterViewInit(): void {
    this.setTooltipTexts();
    this.langService.language$.subscribe((lang: AppLanguage) => {
      this.setTooltipTexts(lang);
    });
    if (this.themeService.currentTheme === 'DARK') {
      enableDarkMode({
        brightness: 100,
        contrast: 90,
        sepia: 10,
      });
      return;
    }
    disableDarkMode();
  }

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

  private setTooltipTexts(lang?: AppLanguage) {
    let itemsDivList = document.querySelectorAll<HTMLElement>(
      '.accessibility_title_item',
    );
    itemsDivList.forEach((item) =>
      tippy(item, { placement: 'auto', zIndex: -1000000 }),
    );

    itemsDivList.forEach((item) => {
      const id = item.id;
      const { text } = labels.panelItems.find((link) => link.id === id)!;

      return tippy(item, {
        content: text[lang || this.langService.language],
        placement: 'left',
        zIndex: 999999999,
      });
    });
  }

  public handleIncrementFontSize() {
    this.accessibilityService.incrementFontSize();
  }

  public handleDecrementFontSize() {
    this.accessibilityService.decrementFontSize();
  }
}
