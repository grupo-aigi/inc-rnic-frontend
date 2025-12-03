import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../../../../../../services/auth/auth.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';


@Component({
  standalone: true,
  selector: 'app-change-role-popup',
  templateUrl: './change-role-popup.component.html',
  imports: [],
})
export class ChangeRolePopupComponent implements OnInit {
  @Output() public onChangeRole: EventEmitter<void> = new EventEmitter();
  public constructor(
    private authService: AuthService,
    private toastService: ToastrService,
    private router: Router,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {}

  public get userInfo() {
    return this.authService.userInfo;
  }

  public get lang() {
    return this.langService.language;
  }

  public isTheActiveRole(role: string) {
    return this.authService.activeRole!.role === role;
  }

  public handleChangeActiveRole(selectedRole: string) {
    this.router.navigate(['/intranet']).then((result) => {
      if (result) {
        this.authService.changeActiveRole(selectedRole);
        this.toastService.clear();
        this.toastService.success(
          'Se ha cambiado su rol exitosamente',
          'Cambio de rol',
        );
        this.onChangeRole.emit();
      }
    });
  }
}
