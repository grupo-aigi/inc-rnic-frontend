
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../../../../../../services/auth/auth.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './change-password.lang';

@Component({
  standalone: true,
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  imports: [ReactiveFormsModule],
})
export class ChangePasswordComponent {
  public formGroup: FormGroup = this.formBuilder.group({
    currentPassword: this.formBuilder.group({
      value: ['', [Validators.required]],
      display: [false],
    }),
    newPassword: this.formBuilder.group({
      value: ['', [Validators.required, this.validateSamePassword]],
      display: [false],
    }),
    confirmPassword: this.formBuilder.group({
      value: ['', [Validators.required, this.validateSamePassword]],
      display: [false],
    }),
  });

  public constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastService: ToastrService,
    private langService: LangService,
  ) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public get showCurrentPassword(): boolean {
    return this.formGroup.get('currentPassword')?.get('display')?.value;
  }

  public get showNewPassword(): boolean {
    return this.formGroup.get('newPassword')?.get('display')?.value;
  }

  public get showConfirmPassword(): boolean {
    return this.formGroup.get('confirmPassword')?.get('display')?.value;
  }

  private validateSamePassword(control: FormControl): ValidationErrors | null {
    const newPassword = control.parent?.parent
      ?.get('newPassword')
      ?.get('value');
    const confirmPassword = control.parent?.parent
      ?.get('confirmPassword')
      ?.get('value');

    if (!(newPassword?.value === confirmPassword?.value)) {
      return { passwordsDoNotMatch: true };
    } else {
      newPassword?.setErrors(null);
      confirmPassword?.setErrors(null);
    }
    return null;
  }

  public handleToggleVisibility(fieldName: string) {
    const field = this.formGroup.get(fieldName)?.get('display');
    if (field) {
      field.setValue(!field.value);
    }
  }

  public isFieldInvalid(fieldName: string): any {
    return (
      this.formGroup.get(fieldName)?.errors &&
      this.formGroup.get(fieldName)?.touched
    );
  }

  public inputHasError(fieldName: string, errorName: string) {
    return (
      this.formGroup.get(fieldName)?.get('value')?.hasError(errorName) &&
      this.formGroup.get(fieldName)?.get('value')?.touched
    );
  }

  public handleSubmit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return this.toastService.error(
        'Por favor revise los datos ingresados e intente nuevamente',
      );
    }
    const email = this.authService.userInfo?.email || '';
    const currentPassword = this.formGroup.get('currentPassword')?.get('value')
      ?.value as string;
    const newPassword = this.formGroup.get('newPassword')?.get('value')
      ?.value as string;
    return this.authService
      .changePassword({
        currentPassword,
        newPassword,
        email,
      })
      .subscribe({
        next: ({ message }) => {
          this.toastService.success(message);
          this.formGroup.reset();
        },
        error: () => {
          this.toastService.error(
            'Ha ocurrido un error al intentar cambiar la contraseña',
          );
        },
      });
  }

  public handleDenyPaste(event: ClipboardEvent) {
    this.toastService.error('No se permite pegar en este campo');
    event.preventDefault();
  }
}
