import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrModule, ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../../../../../../services/auth/auth.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './auth-options-popup.lang';

export type UserOptionsPopup = 'LOGIN' | 'CHANGE_PASSWORD' | 'RECOVER_PASSWORD';

@Component({
  standalone: true,
  selector: 'app-auth-options-popup',
  templateUrl: './auth-options-popup.component.html',
  imports: [ReactiveFormsModule, CommonModule, ToastrModule],
})
export class AuthOptionsPopupComponent {
  public componentToShow: UserOptionsPopup = 'LOGIN';
  @Output('onClosePopup') public onClosePopup: EventEmitter<void> =
    new EventEmitter();
  @ViewChild('containerRef') public containerRef!: ElementRef<HTMLDivElement>;

  public passwordTextType: 'password' | 'text' = 'password';
  public editPasswordTextType: 'password' | 'text' = 'password';

  public loginFormGroup: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.maxLength(100)]],
  });

  public changePassFormGroup: FormGroup = this.formBuilder.group({
    currPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.maxLength(100)]],
  });

  public constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService,
    private langService: LangService,
  ) {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public isLoginFieldInvalid(fieldName: string): any {
    return (
      this.loginFormGroup.get(fieldName)?.errors &&
      this.loginFormGroup.get(fieldName)?.touched
    );
  }

  public isChangePassFieldInvalid(fieldName: string): any {
    return (
      this.changePassFormGroup.get(fieldName)?.errors &&
      this.changePassFormGroup.get(fieldName)?.touched
    );
  }

  public togglePasswordTextType() {
    this.passwordTextType =
      this.passwordTextType === 'password' ? 'text' : 'password';
  }

  public toggleEditPasswordTextType() {
    this.editPasswordTextType =
      this.editPasswordTextType === 'password' ? 'text' : 'password';
  }

  public handleChangeComponent(componentToShow: UserOptionsPopup) {
    this.componentToShow = componentToShow;
  }

  public handleLogin() {
    if (this.loginFormGroup.invalid) {
      this.loginFormGroup.markAllAsTouched();
      return;
    }
    const email = this.loginFormGroup.get('email')?.value as string;
    const password = this.loginFormGroup.get('password')?.value as string;

    return this.authService
      .login({ email, password })
      .then(() => {
        if (this.authService.userInfo?.changedPass) {
          // clear navigation history
          this.router.navigated = false;
          this.router.navigate(['/intranet']);
          return;
        }
        this.componentToShow = 'CHANGE_PASSWORD';
      })
      .catch(() => {
        this.toastrService.error(labels.errorOnLogin[this.lang]);
      });
  }

  public handleClosePopup() {
    this.onClosePopup.emit();
  }

  public handleChangePassword() {
    if (this.changePassFormGroup.invalid) {
      this.changePassFormGroup.markAllAsTouched();
      return;
    }

    const email = this.loginFormGroup.get('email')?.value as string;
    const currentPassword = this.changePassFormGroup.get('currPassword')
      ?.value as string;
    const newPassword = this.changePassFormGroup.get('newPassword')
      ?.value as string;

    return this.authService
      .changePassword({ email, currentPassword, newPassword })
      .subscribe({
        next: (result) => {
          this.toastrService.success(
            labels.passwordChangedSuccessfully[this.lang],
          );
          this.router.navigate(['/intranet']);
          return;
        },
        error: () => {
          this.toastrService.error(labels.errorUploadingPassword[this.lang]);
        },
      });
  }
}
