
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../../../../services/auth/auth.service';
import commissions from '../../../../../../services/intranet/commissions/commissions.data';
import { Commissions } from '../../../../../../services/intranet/commissions/commissions.interfaces';
import { UserProfileInfo } from '../../../../../../services/intranet/profile/profile.interfaces';
import { UserProfileService } from '../../../../../../services/intranet/profile/profile.service';
import { UserInfo } from '../../../../../../services/intranet/user/user.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { UserPrimaryInfoComponent } from './components/user-primary-info/user-primary-info.component';
import labels from './profile-edit-page.lang';

@Component({
  standalone: true,
  selector: 'app-profile-edit-page',
  templateUrl: './profile-edit-page.component.html',
  imports: [
    ReactiveFormsModule,
    ChangePasswordComponent,
    UserPrimaryInfoComponent
],
})
export class ProfileEditPage implements OnInit {
  public formGroup: FormGroup;
  public avatarImage: string = '';

  public constructor(
    private title: Title,
    private router: Router,
    private formBuilder: FormBuilder,
    public toastService: ToastrService,
    public authService: AuthService,
    private langService: LangService,
    private profileService: UserProfileService,
  ) {
    this.formGroup = this.initialFormValues;
  }

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });

    if (!this.authService.userInfo) {
      this.router.navigate(['/intranet']);
      return;
    }
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

  public get commissions() {
    return commissions;
  }

  public isCommissionSelected(commission: Commissions): boolean {
    const commissionsControl = this.formGroup.get('commissions')?.get('value');
    if (!commissionsControl) return false;

    const currentCommissions = commissionsControl.value as Commissions[];
    return currentCommissions.some(
      (currentCommission) => currentCommission === commission,
    );
  }

  public handleToggleCommission(commission: Commissions) {
    const commissionsControl = this.formGroup.get('commissions')?.get('value');
    if (!commissionsControl) return;

    const currentCommissions = commissionsControl.value as Commissions[];

    const isCommissionAdded = currentCommissions.some(
      (currentCommission) => currentCommission === commission,
    );

    if (isCommissionAdded) {
      commissionsControl.setValue(
        currentCommissions.filter(
          (currentCommission) => currentCommission !== commission,
        ),
      );
    } else {
      commissionsControl.setValue([...currentCommissions, commission]);
    }
  }

  private get initialFormValues(): FormGroup {
    return this.formBuilder.group({
      fullName: [
        this.authService.userInfo?.name,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      email: this.formBuilder.group({
        value: [this.authService.userInfo?.email],
        display: [this.authService.userInfo?.displayPolicies.showEmail],
      }),
      identification: this.formBuilder.group({
        value: [this.authService.userInfo?.identification],
        display: [
          this.authService.userInfo?.displayPolicies.showIdentification,
        ],
      }),
      phoneNumber: this.formBuilder.group({
        value: [
          this.authService.userInfo?.phoneNumber,
          [Validators.pattern('^[0-9]*$')],
        ],
        display: [this.authService.userInfo?.displayPolicies.showPhone],
      }),
      description: this.formBuilder.group({
        value: [
          this.authService.userInfo?.description,
          [Validators.minLength(3), Validators.maxLength(500)],
        ],
        display: [this.authService.userInfo?.displayPolicies.showDescription],
      }),
      linkedin: this.formBuilder.group({
        value: [
          this.authService.userInfo?.linkedin,
          [
            Validators.pattern(
              '^(https?://)?([a-z0-9-]+.)?linkedin.com/(pub|in|profile)/[a-zA-Z0-9_-]+/?$',
            ),
          ],
        ],
        display: [this.authService.userInfo?.displayPolicies.showLinkedin],
      }),
      scopus: this.formBuilder.group({
        value: [
          this.authService.userInfo?.scopus,
          [Validators.pattern('^https://www.scopus.com/.*$')],
        ],
        display: [this.authService.userInfo?.displayPolicies.showScopus],
      }),
      orcid: this.formBuilder.group({
        value: [
          this.authService.userInfo?.orcid,
          [
            Validators.pattern(
              '^(https?://)?([a-z0-9-]+.)?orcid.org/[a-zA-Z0-9_-]+/?$',
            ),
          ],
        ],
        display: [this.authService.userInfo?.displayPolicies.showOrcid],
      }),
      commissions: this.formBuilder.group({
        value: [this.authService.userInfo?.commissions],
        display: [this.authService.userInfo?.displayPolicies.showCommissions],
      }),
    });
  }

  public handleToggleVisibility(fieldName: string) {
    const visibility = this.formGroup.get(fieldName)?.get('display')
      ?.value as boolean;
    this.toastService.success(
      `Una vez actualizados los cambios, el valor seleccionado ${
        !visibility ? 'si' : 'no'
      } se mostrará en el perfil`,
    );
    this.formGroup.get(fieldName)?.get('display')?.setValue(!visibility);
  }

  public isFieldInvalid(control: string, nestedControl?: string): any {
    if (nestedControl) {
      const formControl = this.formGroup.get(control)?.get(nestedControl);
      return formControl?.invalid && formControl?.touched;
    }
    const formControl = this.formGroup.get(control);
    return formControl?.invalid && formControl?.touched;
  }

  public get userInfo(): UserInfo {
    return this.authService.userInfo!;
  }

  public handleRestoreValues() {
    this.toastService.info('Valores restaurados');
    this.formGroup = this.initialFormValues;
  }

  public handleCancelUpdate() {
    this.toastService.info('Actualización de perfil cancelada');
    this.router.navigate([`/intranet/perfil`]);
  }

  public handleSubmit() {
    if (this.formGroup.invalid) {
      this.toastService.error('El formulario contiene errores');
      return;
    }
    const value = this.formGroup.value;
    const updatedInfo: UserProfileInfo = {
      fullName: value.fullName,
      phoneNumber: value.phoneNumber.value,
      description: value.description.value,
      linkedin: value.linkedin.value,
      scopus: value.scopus.value,
      orcid: value.orcid.value,
      commissions: value.commissions.value,
      displayPolicies: {
        showEmail: value.email.display,
        showOrcid: value.orcid.display,
        showPhone: value.phoneNumber.display,
        showScopus: value.scopus.display,
        showLinkedin: value.linkedin.display,
        showDescription: value.description.display,
        showCommissions: value.commissions.display,
        showIdentification: value.identification.display,
      },
    };

    return this.profileService.updateUserInformation(updatedInfo).subscribe({
      next: (value) => {
        this.toastService.success('Perfil actualizado');
        return this.authService.refreshAuth().subscribe({
          next: () => {
            this.router.navigate([`/intranet/perfil`]);
          },
          error: () => {
            this.toastService.error('Error al actualizar perfil');
          },
        });
      },
    });
  }
}
