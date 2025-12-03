import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppLanguage } from './lang.interfaces';

import labelsEN from '../../../../assets/i18n/en.json';
import labelsES from '../../../../assets/i18n/es.json';
import haveSameProperties from '../../../../assets/i18n/schema-validation';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  private _language!: AppLanguage;
  private sub = new Subject<AppLanguage>();
  public language$ = this.sub.asObservable();

  public constructor() {
    const localsComplete: boolean = haveSameProperties(labelsEN, labelsES);
    if (!localsComplete)
      throw new Error('The labels in the languages are not the same');

    const storedLanguage = localStorage.getItem('app_language');
    if (storedLanguage) {
      this._language = storedLanguage as AppLanguage;
    } else {
      const language = navigator.language;
      this._language =
        (language.split('-')[0] as AppLanguage) || AppLanguage.SPANISH;
    }
  }

  public get language(): AppLanguage {
    return this._language;
  }

  public get labels() {
    if (this._language === AppLanguage.ENGLISH) {
      return labelsEN;
    } else if (this._language === AppLanguage.SPANISH) {
      return labelsES;
    }
    return labelsES;
  }

  public set changeLanguage(language: AppLanguage) {
    this._language = language;
    localStorage.setItem('app_language', this._language.toString());
    this.sub.next(this._language);
  }
}
