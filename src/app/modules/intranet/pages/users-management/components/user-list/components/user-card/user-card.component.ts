import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import commissions from '../../../../../../../../services/intranet/commissions/commissions.data';
import { UserProfileManagement } from '../../../../../../../../services/intranet/net-management/net-management.interfaces';
import { UserProfileService } from '../../../../../../../../services/intranet/profile/profile.service';
import {
  Role,
  UserManagement,
} from '../../../../../../../../services/intranet/user/user.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { UploadDocumentsButtonsComponent } from '../upload-documents-buttons/upload-documents-buttons.component';
import { UserCardDetailComponent } from '../user-card-detail/user-card-detail.component';
import labels from './user-card.lang';
import { roles } from '../../../../../../../../services/intranet/user/user.data';

@Component({
  standalone: true,
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  imports: [
    CommonModule,
    UploadDocumentsButtonsComponent,
    UserCardDetailComponent,
  ],
})
export class UserCardComponent implements OnInit {
  @Input() public userInfo!: UserManagement;
  public loading: boolean = false;
  public error: boolean = false;
  public userAvatar: string = '';
  public profileInfo: UserProfileManagement | null = null;
  public loadingProfileInfo: boolean = true;
  public docType: 'LINKING_CERTIFICATE' | 'APPROVAL_LETTER' =
    'LINKING_CERTIFICATE';
  public showDetail: boolean = false;

  public constructor(
    public langService: LangService,
    private resourcesService: ResourcesService,
    private profileService: UserProfileService,
  ) {}

  public ngOnInit(): void {
    this.loading = true;
    this.loading = false;
    this.error = false;
    this.resourcesService
      .getUserAvatarImageByUserId(this.userInfo.id)
      .subscribe({
        next: (value) => {
          if (value.size === 0) {
            this.userAvatar = '';
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            const browserUrl = reader.result as string;
            this.userAvatar = browserUrl;
          };
          reader.readAsDataURL(value);
        },
      });
    this.loadingProfileInfo = true;
    this.profileService.fetchProfileInfo(this.userInfo.id).subscribe({
      next: (response) => {
        this.profileInfo = response;
        this.loadingProfileInfo = false;
      },
    });
  }

  public get labels() {
    return labels;
  }

  public get commissions() {
    return commissions;
  }

  public getRoleLabel(role: string) {
    return roles.find(({ value }) => value === role)?.label[this.lang];
  }

  public getCommissionLabel(commission: string) {
    return this.commissions.find(({ value }) => value === commission)?.label[
      this.lang
    ];
  }

  public getFormattedDate(date: Date): string {
    const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
    const parsedDate = new Date(
      new Date(date).getTime() + timezoneOffsetInMinutes * 60 * 1000,
    );

    const navigatorLanguage = window.navigator.language || 'en-US';

    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    return parsedDate.toLocaleDateString(navigatorLanguage, options);
  }

  public get lang() {
    return this.langService.language;
  }

  public handleToggleDetail() {
    this.showDetail = !this.showDetail;
  }

  public get isRegistered() {
    return this.userInfo.grantedAuthorities
      .map(({ authority }) => authority)
      .includes(Role.ROLE_REGISTERED);
  }
}
