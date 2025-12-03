
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../../../../../../services/auth/auth.service';
import { UserProfileService } from '../../../../../../../../services/intranet/profile/profile.service';
import {
  Role,
  UserManagement,
} from '../../../../../../../../services/intranet/user/user.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { ConfirmDeletePopupComponent } from './components/confirm-delete-popup/confirm-delete-popup.component';
import { LockUntilDatePopupComponent } from './components/lock-until-date-popup/lock-until-date-popup.component';
import labels from './user-card-detail.lang';
import { roles } from '../../../../../../../../services/intranet/user/user.data';

@Component({
  standalone: true,
  selector: 'app-user-card-detail',
  templateUrl: './user-card-detail.component.html',
  imports: [
    LockUntilDatePopupComponent,
    ConfirmDeletePopupComponent
],
})
export class UserCardDetailComponent implements OnInit {
  @Input() public userInfo!: UserManagement;
  @ViewChildren('rolesCheckbox')
  public rolesCheckboxes!: QueryList<ElementRef<HTMLInputElement>>;

  @Output() public onCloseDetail: EventEmitter<void> = new EventEmitter();

  public newRoles: Role[] = [];

  public showDeleteConfirm: boolean = false;

  public constructor(
    public langService: LangService,
    private resourcesService: ResourcesService,
    private profileService: UserProfileService,
    private authService: AuthService,
    private toastService: ToastrService,
  ) {}

  public ngOnInit(): void {
    this.newRoles = this.userInfo.grantedAuthorities.map(
      ({ authority }) => authority,
    );
  }

  public get labels() {
    return labels;
  }

  public get rolesHasChanged(): boolean {
    const haveSameLength =
      this.newRoles.length === this.userInfo.grantedAuthorities.length;
    return (
      !this.newRoles.every((role) =>
        this.userInfo.grantedAuthorities
          .map(({ authority }) => authority)
          .includes(role),
      ) || !haveSameLength
    );
  }

  public get lang() {
    return this.langService.language;
  }

  public handleOpenNewPasswordPopup() {
    this.authService.generateNewPassword(this.userInfo.id).subscribe({
      next: ({ message: password }) => {
        this.toastService.success(
          `
          <br>
          <b>${labels.passwordChanged.title[this.lang]}</b>
          <br>
          <br>
          <span>${labels.passwordChanged.newPassword[this.lang]}:</span>
          <p><b>${password}</b></p>
          `,
          `${labels.passwordChanged.toastTitle[this.lang]}`,
          {
            enableHtml: true,
            tapToDismiss: false,
            disableTimeOut: true,
            positionClass: 'toast-top-center',
            closeButton: true,
          },
        );
      },
      error: (error) => {
        this.toastService.error(labels.errorGeneratingPassword[this.lang]);
      },
    });
  }

  public get isAccountNonLocked() {
    return this.userInfo.accountNonLocked;
  }

  public handleLockUser(until?: Date) {
    return this.lockUserAccount(until);
  }

  public handleShowDeleteConfirm() {
    this.showDeleteConfirm = true;
  }

  private lockUserAccount(until?: Date) {
    this.authService.lockUserAccount(this.userInfo.id, until).subscribe({
      next: ({ message }) => {
        this.toastService.success(
          labels.userAccountLockedSuccessfully[this.lang],
        );
        this.userInfo.blockedStatus = {
          blockedAt: new Date(),
          until,
        };
        this.userInfo.accountNonLocked = false;
      },
      error: (error) => {
        return this.toastService.error(labels.errorInactivatingUser[this.lang]);
      },
    });
  }

  public handleReactivateUser() {
    this.authService.unlockUserAccount(this.userInfo.id).subscribe({
      next: ({ message }) => {
        this.toastService.success(
          labels.userAccountRestoredSuccessfully[this.lang],
        );
        this.userInfo.blockedStatus = null;
        this.userInfo.accountNonLocked = true;
      },
      error: (error) => {
        this.toastService.error(labels.errorActivatingUser[this.lang]);
      },
    });
  }

  public handleConfirmChangeRoles() {
    this.authService
      .updateUserRoles(this.userInfo.id, this.newRoles)
      .subscribe({
        next: ({}) => {
          this.toastService.success(labels.rolesUpdatedSuccessfully[this.lang]);
          this.userInfo.grantedAuthorities = this.newRoles.map((role) => ({
            authority: role,
          }));
        },
        error: (error) => {
          this.toastService.error(labels.errorUpdatingRoles[this.lang]);
        },
      });
  }

  public handleDeleteUser() {
    this.authService.deleteUser(this.userInfo.id).subscribe({
      next: ({}) => {
        this.userInfo.active = false;
        return this.toastService.success(
          labels.userDeletedSuccessfully[this.lang],
        );
      },
      error: (error) => {
        this.toastService.error(labels.errorDeletingUser[this.lang]);
      },
    });
  }

  public handleResetChangeRoles() {
    this.newRoles = this.userInfo.grantedAuthorities.map(
      ({ authority }) => authority,
    );
    // Get the input elements inside the div
    this.rolesCheckboxes.forEach((input) => {
      input.nativeElement.checked = this.isRoleSelected(
        input.nativeElement.value as Role,
      );
    });
  }

  public isRoleSelected(role: Role) {
    return this.userInfo.grantedAuthorities
      .map(({ authority }) => authority)
      .includes(role);
  }

  public get isSuperAdmin() {
    return this.isRoleSelected(Role.ROLE_SUPER_ADMIN);
  }

  public getRoleLabel(role: Role) {
    return roles.find(({ value }) => value === role)?.label[this.lang];
  }

  public get filteredRoles() {
    return roles.filter(({ value }) => {
      return (
        value !== Role.ALL_ROLES &&
        value !== Role.ROLE_SUPER_ADMIN &&
        value !== Role.ROLE_REGISTERED
      );
    });
  }

  public handleToggleRole(role: Role) {
    const isSelected = this.newRoles.includes(role);
    if (isSelected) {
      this.newRoles = this.newRoles.filter((r) => r !== role);
    } else {
      this.newRoles.push(role);
    }
  }
}
