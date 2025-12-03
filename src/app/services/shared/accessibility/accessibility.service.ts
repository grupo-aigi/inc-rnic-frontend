import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccessibilityService {
  public fontScale = 1; // from 1 to 7
  public constructor() {
    this.initFontScale();
  }

  private initFontScale() {
    const fontScale = localStorage.getItem('font_scale');
    if (
      fontScale &&
      !isNaN(parseInt(fontScale)) &&
      parseInt(fontScale) >= 1 &&
      parseInt(fontScale) <= 7
    ) {
      this.fontScale = parseInt(fontScale);
      const dynamicFontElements = Array.from(
        document.getElementsByClassName(
          'dynamic-font-size',
        ) as HTMLCollectionOf<HTMLElement>,
      );
      dynamicFontElements.forEach((element) => {
        const currentFontSize = window.getComputedStyle(element).fontSize;
        const currentFontSizeValue = parseFloat(currentFontSize);
        const newFontSize = currentFontSizeValue + this.fontScale - 1;
        element.style.fontSize = `${newFontSize}px`;
      });
    } else {
      this.fontScale = 1;
      localStorage.setItem('font_scale', this.fontScale.toString());
    }
  }

  public incrementFontSize() {
    if (this.fontScale >= 7) return;
    const dynamicFontElements = Array.from(
      document.getElementsByClassName(
        'dynamic-font-size',
      ) as HTMLCollectionOf<HTMLElement>,
    );

    if (!dynamicFontElements || dynamicFontElements.length === 0) return;

    dynamicFontElements.forEach((element) => {
      const currentFontSize = window.getComputedStyle(element).fontSize;
      const currentFontSizeValue = parseFloat(currentFontSize);
      const newFontSize = currentFontSizeValue + 1;
      element.style.fontSize = `${newFontSize}px`;
    });
    this.fontScale++;
    localStorage.setItem('font_scale', this.fontScale.toString());
  }

  public decrementFontSize() {
    if (this.fontScale === 1) return;

    const dynamicFontElements = Array.from(
      document.getElementsByClassName(
        'dynamic-font-size',
      ) as HTMLCollectionOf<HTMLElement>,
    );

    if (!dynamicFontElements || dynamicFontElements.length === 0) return;

    dynamicFontElements.forEach((element) => {
      const currentFontSize = window.getComputedStyle(element).fontSize;
      const currentFontSizeValue = parseFloat(currentFontSize);
      const newFontSize = currentFontSizeValue - 1;
      element.style.fontSize = `${newFontSize}px`;
    });
    this.fontScale--;
    localStorage.setItem('font_scale', this.fontScale.toString());
  }
}
