
import { Component, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { CommissionMinuteInfo } from '../../../../../../../../services/intranet/minutes/minutes.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './create-commission-minute.lang';
import { CommissionDetail } from '../../../../../../../../services/intranet/commissions/commissions.interfaces';
import commissions from '../../../../../../../../services/intranet/commissions/commissions.data';

@Component({
  standalone: true,
  selector: 'app-create-commission-minute',
  templateUrl: './create-commission-minute.component.html',
  imports: [ReactiveFormsModule],
})
export class CreateCommissionMinuteComponent {
  @Output() onCreate: EventEmitter<CommissionMinuteInfo> = new EventEmitter();

  public formGroup: FormGroup = this.formBuilder.group({
    id: [crypto.randomUUID(), [Validators.required]],
    createdAt: [this.getCurrentDate(), [Validators.required]],
    name: ['', [Validators.required]],
    meetingDate: [, [Validators.required]],
    start: ['', [Validators.required]],
    end: ['', [Validators.required, this.timeAfterStartTime]],
    subject: ['', [Validators.required]],
    place: ['', [Validators.required]],
    commission: ['', [Validators.required]],
  });

  public constructor(
    private formBuilder: FormBuilder,
    private langService: LangService,
    private toastService: ToastrService,
  ) {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public get commissions() {
    return commissions;
  }

  private dateInFuture(control: AbstractControl): ValidationErrors | null {
    const deadlineDate = new Date(control.value);
    if (deadlineDate < new Date()) {
      return { dateAfterNow: true };
    }
    return null;
  }

  private timeAfterStartTime(
    control: AbstractControl,
  ): ValidationErrors | null {
    const startTime = control.parent?.get('start')?.value as string;
    if (!startTime) {
      return { missingStartingDate: true };
    }
    const endTime = control.value as string;
    if (endTime < startTime) {
      return { timeAfterStartTime: true };
    }
    return null;
  }

  public isFieldInvalid(fieldName: string): any {
    return (
      this.formGroup.get(fieldName)?.errors &&
      this.formGroup.get(fieldName)?.touched
    );
  }

  public handleToggleCommission(commission: CommissionDetail) {
    this.formGroup.get('commission')?.setValue(commission.value);
  }

  private getCurrentDate() {
    return new Date().toISOString().split('T')[0];
  }

  public handleSubmit() {
    if (this.formGroup.invalid) {
      this.toastService.error('El formulario contiene campos inválidos');
      this.formGroup.markAllAsTouched();
      return;
    }
    const meetingDate = this.formGroup.get('meetingDate')?.value as string;
    const startTime = this.formGroup.get('start')?.value as string;
    const endTime = this.formGroup.get('end')?.value as string;
    delete this.formGroup.value.meetingDate;
    const minuteInfo: CommissionMinuteInfo = {
      ...this.formGroup.value,
      start: new Date(`${meetingDate}T${startTime}:00`),
      end: new Date(`${meetingDate}T${endTime}:00`),
    };
    delete minuteInfo.createdAt;
    this.onCreate.emit(minuteInfo);
  }
}
