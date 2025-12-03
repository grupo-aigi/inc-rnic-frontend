
import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../../../../../../services/auth/auth.service';
import { UserInfo } from '../../../../../../../../services/intranet/user/user.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { UploadOrReuseImageComponent } from '../../../../../shared/components/upload-or-reuse-image/upload-or-reuse-image.component';
import labels from './user-primary-info.lang';

@Component({
  standalone: true,
  selector: 'app-user-primary-info',
  templateUrl: './user-primary-info.component.html',
  imports: [UploadOrReuseImageComponent],
})
export class UserPrimaryInfoComponent implements OnInit {
  public constructor(
    private toastService: ToastrService,
    public authService: AuthService,
    private langService: LangService,
    public resourcesService: ResourcesService,
  ) {}

  public ngOnInit(): void {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public get activeRole() {
    return this.authService.activeRole!.role;
  }

  public get userInfo(): UserInfo {
    return this.authService.userInfo!;
  }

  public handleSetProfileImage(imageName: string) {
    this.resourcesService
      .updateUserAvatarImage(imageName)
      .then(() => this.authService.refreshUserAvatarImage())
      .then(() => {
        this.toastService.success(
          'Your profile image has been updated successfully.',
        );
      })
      .catch(() => {
        this.toastService.error(
          'There was an error updating your profile image.',
        );
      });
  }
}
