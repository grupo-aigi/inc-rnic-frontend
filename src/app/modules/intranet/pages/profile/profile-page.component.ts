
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../services/auth/auth.service';
import commissions from '../../../../services/intranet/commissions/commissions.data';
import {
  Role,
  UserInfo,
} from '../../../../services/intranet/user/user.interfaces';
import { LangService } from '../../../../services/shared/lang/lang.service';
import { ActivityLogComponent } from './components/activity-log/activity-log.component';
import {
  DisableAccountPopupComponent,
  DisableAccountType,
} from './components/disable-account-popup/disable-account-popup.component';
import labels from './profile-page.lang';

@Component({
  standalone: true,
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  imports: [
    RouterLink,
    ActivityLogComponent,
    DisableAccountPopupComponent
],
})
export class ProfilePage implements OnInit {
  public loadingUserInfo = true;
  public pendingToRetire = false;

  public constructor(
    private title: Title,
    private router: Router,
    public authService: AuthService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });

    if (!this.authService.userInfo) {
      this.router.navigate(['/intranet']);
      return;
    }

    this.fetchRetirementStatus();
    this.loadingUserInfo = false;
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public get activeRole() {
    return this.authService.activeRole!.role;
  }

  private fetchRetirementStatus() {
    this.authService.fetchRetirementStatus().then((status) => {
      this.pendingToRetire = status;
    });
  }

  public isAdmin() {
    return this.authService.userInfo?.roles
      .map(({ role }) => role)
      .includes(Role.ROLE_SUPER_ADMIN);
  }

  public get commissions(): string[] {
    return this.userInfo.commissions.map(
      (commission) =>
        this.commissionDetails.find((detail) => detail.value === commission)
          ?.label[this.lang] || '',
    );
  }

  public get commissionDetails() {
    return commissions;
  }

  public get userInfo(): UserInfo {
    return this.authService.userInfo!;
  }

  public proceedToDisableFormat(disableType: DisableAccountType) {
    return this.router.navigateByUrl(`/intranet/retiro?tipo=${disableType}`);
  }
}
