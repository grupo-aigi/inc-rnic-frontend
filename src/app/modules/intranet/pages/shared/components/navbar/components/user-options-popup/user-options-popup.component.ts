import { Component } from '@angular/core';

import { AuthService } from '../../../../../../../../services/auth/auth.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './user-options-popup.language';

@Component({
  standalone: true,
  selector: 'app-user-options-popup',
  templateUrl: './user-options-popup.component.html',
})
export class UserOptionsPopupComponent {
  public constructor(
    private authService: AuthService,
    private langService: LangService,
  ) {}

  public handleLogout() {
    this.authService.logout();
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }
}
