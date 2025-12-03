import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
  deps: [DarkReader],
})
export class ThemeService {
  private _currentTheme: 'LIGHT' | 'DARK';

  public constructor() {
    const theme = localStorage.getItem('theme') as 'LIGHT' | 'DARK';
    if (theme) {
      this._currentTheme = theme;
      return;
    }
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkScheme.matches) {
      this._currentTheme = 'DARK';
      localStorage.setItem('theme', 'DARK');
    } else {
      this._currentTheme = 'LIGHT';
      localStorage.setItem('theme', 'LIGHT');
    }
  }

  public get currentTheme() {
    return this._currentTheme;
  }

  public set currentTheme(theme: 'LIGHT' | 'DARK') {
    this._currentTheme = theme;
    localStorage.setItem('theme', theme);
  }
}
