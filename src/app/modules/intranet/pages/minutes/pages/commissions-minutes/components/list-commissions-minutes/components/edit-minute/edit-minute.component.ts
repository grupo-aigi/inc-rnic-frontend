import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { ToastrModule, ToastrService } from 'ngx-toastr';

import commissions from '../../../../../../../../../../services/intranet/commissions/commissions.data';
import {
  CommissionDetail,
  Commissions,
} from '../../../../../../../../../../services/intranet/commissions/commissions.interfaces';
import { CommissionMinutesService } from '../../../../../../../../../../services/intranet/minutes/commission-minute.service';
import { CommissionMinuteInfo } from '../../../../../../../../../../services/intranet/minutes/minutes.interfaces';
import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import { EditCommissionMinuteAssistantsComponent } from './components/edit-assistants/edit-minute-assistants.component';
import labels from './edit-minute.lang';

@Component({
  standalone: true,
  selector: 'app-edit-commission-minute',
  templateUrl: './edit-minute.component.html',
  imports: [
    CommonModule,
    ToastrModule,
    ReactiveFormsModule,
    EditCommissionMinuteAssistantsComponent,
  ],
})
export class EditCommissionMinuteComponent implements OnInit {
  @Input() public minute!: CommissionMinuteInfo;
  @Output() public onClose: EventEmitter<void> = new EventEmitter();
  @Output() public onEdited: EventEmitter<CommissionMinuteInfo> =
    new EventEmitter();
  @Output() public onAddAssistant: EventEmitter<void> =
    new EventEmitter<void>();
  @Output() public onRemoveAssistant: EventEmitter<void> =
    new EventEmitter<void>();

  public formGroup: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    meetingDate: ['', [Validators.required, this.dateInFuture]],
    start: ['', [Validators.required]],
    end: ['', [Validators.required, this.timeAfterStartTime]],
    subject: ['', [Validators.required]],
    place: ['', [Validators.required]],
    commission: ['', [Validators.required]],
  });

  public hasMinuteStarted: boolean = false;

  public constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastrService,
    private langService: LangService,
    private commissionMinuteService: CommissionMinutesService,
  ) {}

  public ngOnInit(): void {
    this.initFormValues();

    this.hasMinuteStarted =
      new Date().getTime() > new Date(this.minute.start).getTime();
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public get commissions() {
    return commissions;
  }

  public initFormValues() {
    this.formGroup.get('name')?.setValue(this.minute.name);
    this.formGroup
      .get('meetingDate')
      ?.setValue(this.getDate(this.minute.start));
    this.formGroup.get('start')?.setValue(this.getTime(this.minute.start));
    this.formGroup.get('end')?.setValue(this.getTime(this.minute.end));
    this.formGroup.get('subject')?.setValue(this.minute.subject);
    this.formGroup.get('place')?.setValue(this.minute.place);
    this.formGroup
      .get('commission')
      ?.setValue(this.minute.commission.networkCommission);
  }

  public handleIncrementAssistants() {
    this.onAddAssistant.emit();
  }

  public handleDecrementAssistants() {
    this.onRemoveAssistant.emit();
  }

  private getTime(dateString: Date): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    date.setHours(date.getHours() - offset / 60);
    const hours =
      date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return `${hours}:${minutes}`;
  }

  public handleToggleCommission(commission: CommissionDetail) {
    this.formGroup.get('commission')?.setValue(commission.value);
  }

  public isCommissionSelected(commission: CommissionDetail) {
    const commissionValue = this.formGroup.get('commission')
      ?.value as Commissions;
    return commissionValue === this.minute.commission.networkCommission;
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

  private getDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  public isFieldInvalid(fieldName: string): any {
    return (
      this.formGroup.get(fieldName)?.errors &&
      this.formGroup.get(fieldName)?.touched
    );
  }

  public handleCloseEdit() {
    this.toastService.info('La edición ha sido cancelada');
    this.onClose.emit();
  }

  public handleResetForm() {
    this.toastService.info('El formulario ha sido reestablecido');
    this.initFormValues();
    this.formGroup.markAsUntouched();
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
    const { id, value } = this.commissions.find(
      (commission) =>
        commission.value === this.formGroup.get('commission')?.value,
    )!;
    const minuteInfo: CommissionMinuteInfo = {
      ...this.formGroup.value,
      id: this.minute.id,
      author: this.minute.author,
      start: new Date(`${meetingDate}T${startTime}:00`),
      end: new Date(`${meetingDate}T${endTime}:00`),
      commission: { id, networkCommission: value },
    };
    delete minuteInfo.createdAt;
    this.commissionMinuteService
      .editMinute(this.minute.id, minuteInfo)
      .subscribe({
        next: () => {
          this.toastService.success('La minuta ha sido editada con éxito');
          this.onEdited.emit({
            ...minuteInfo,
            commission: { id, networkCommission: value },
          });
        },
        error: () => {
          this.toastService.error(
            'Ha ocurrido un error al editar la minuta, por favor intenta de nuevo',
          );
        },
      });
  }
}
