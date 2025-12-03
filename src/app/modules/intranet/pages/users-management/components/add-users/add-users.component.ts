
import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import {
  RegisterCredentialsFromIntranet,
  UserRegister,
} from '../../../../../../services/auth/auth.interfaces';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './add-users.lang';
import { CompletedRegisterComponent } from './components/completed-register/completed-register.component';
import { UserInputFormComponent } from './components/user-input-form/user-input-form.component';

@Component({
  standalone: true,
  templateUrl: './add-users.component.html',
  selector: 'app-add-users',
  imports: [UserInputFormComponent, CompletedRegisterComponent],
})
export class AddUsersComponent implements OnInit {
  public loading: boolean = true;
  public hasLoadedPDFs: boolean = false;
  public error: boolean = false;
  public registers: UserRegister[] = [];
  public forceValidate: boolean = false;

  public constructor(
    private langService: LangService,
    private toastService: ToastrService,
    private authService: AuthService,
  ) {}

  public ngOnInit(): void {
    this.loading = false;
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public onFilesSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedFiles = inputElement.files;
    if (!selectedFiles) {
      this.toastService.warning('No se seleccionó ningún archivo');
      return;
    }
    const filesArray = Array.from(selectedFiles);
    const allFilesArePDF = filesArray.every(
      (file) => file.type === 'application/pdf',
    );

    if (!allFilesArePDF) {
      this.toastService.error('Todos los archivos deben ser PDF');
      return;
    }
    this.hasLoadedPDFs = true;
    this.registers = filesArray.map((file) => ({
      id: crypto.randomUUID(),
      file,
    }));
  }

  public handleDeleteAllRegisters() {
    this.registers = [];
    this.hasLoadedPDFs = false;
  }

  public handleDeleteRegister(id: string) {
    this.registers = this.registers.filter((register) => register.id !== id);
    if (this.registers.length === 0) {
      this.hasLoadedPDFs = false;
    }
  }

  public handleCompleteRegister(id: string) {
    const register = this.registers.find((register) => register.id === id);
    if (!register) return;
    register.completed = true;
    if (this.registers.every((register) => register.completed)) {
      this.toastService.success('Se han completado todos los registros');
      this.registers = [];
      this.hasLoadedPDFs = false;
    }
    if (this.registers.length === 0) {
      this.forceValidate = false;
    }
  }

  public handleSubmitRegister(id: string) {
    const register = this.registers.find((register) => register.id === id);
    if (!register) return;
    if (!register.valid) return;
    if (!register.userInfo) return;
    const { userInfo } = register;
    const { file } = register;
    return this.authService.registerUserFromIntranet(userInfo, file).subscribe({
      next: ({ ok }) => {
        if (!ok) {
          this.toastService.error('No se pudo registrar el usuario');
          return;
        }
        this.toastService.success(
          `El usuario con email ${userInfo.email} se registró correctamente`,
        );
        // this.handleDeleteRegister(id);
        this.handleCompleteRegister(id);
      },
      error: (err) => {
        const { error } = err;
        const { message } = error;
        this.toastService.error(message);
      },
    });
  }

  public handleClickOnPDFButton(event: Event) {
    if (this.hasLoadedPDFs) {
      this.toastService.warning('Ya se cargaron los archivos');
      event.preventDefault();
    }
  }

  public handleSubmitAllRegisters() {
    const allAreValid = this.registers.every((register) => register.valid);
    if (!allAreValid) {
      this.forceValidate = true;
      this.toastService.error(
        'Debe completar todos los campos en cada uno de los registros',
      );
      return;
    }
    this.registers.forEach((register) => {
      if (register.valid) {
        this.handleSubmitRegister(register.id);
      }
    });
  }
}
