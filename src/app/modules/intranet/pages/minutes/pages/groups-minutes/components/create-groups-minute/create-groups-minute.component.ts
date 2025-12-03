
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrModule, ToastrService } from 'ngx-toastr';

import { GroupMinuteInfo } from '../../../../../../../../services/intranet/minutes/minutes.interfaces';
import { networkGroups } from '../../../../../../../../services/shared/groups/groups.data';
import {
  NetworkGroupDetail,
  NetworkGroups,
} from '../../../../../../../../services/shared/groups/groups.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './create-groups-minute.lang';

@Component({
  standalone: true,
  selector: 'app-create-group-minute',
  templateUrl: './create-groups-minute.component.html',
  imports: [ReactiveFormsModule, ToastrModule],
})
export class CreateGroupMinuteComponent implements OnInit {
  @Output() onCreate: EventEmitter<GroupMinuteInfo> = new EventEmitter();
  public groupDetail: NetworkGroupDetail | undefined;
  public formGroup: FormGroup = this.formBuilder.group({
    id: [crypto.randomUUID(), [Validators.required]],
    createdAt: [this.getCurrentDate(), [Validators.required]],
    name: ['', [Validators.required]],
    meetingDate: [, [Validators.required]],
    start: ['', [Validators.required]],
    end: ['', [Validators.required, this.timeAfterStartTime]],
    subject: ['', [Validators.required]],
    place: ['', [Validators.required]],
  });

  public constructor(
    private formBuilder: FormBuilder,
    private langService: LangService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastrService,
  ) {}

  public ngOnInit(): void {
    this.route.url.subscribe((url) => {
      const { path: groupPath } = url[0];

      if (groupPath === 'grupo-coordinador') {
        this.groupDetail = networkGroups.find(
          (group) => group.value === NetworkGroups.COORDINATING,
        );
      } else if (groupPath === 'grupo-facilitador') {
        this.groupDetail = networkGroups.find(
          (group) => group.value === NetworkGroups.FACILITATING,
        );
      } else {
        this.toastService.error('Grupo de trabajo inválido');
        this.router.navigate(['/intranet/actas']);
        return;
      }
    });
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public get groups() {
    return networkGroups;
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

  public handleToggleCommission(group: NetworkGroupDetail) {
    this.formGroup.get('group')?.setValue(group.value);
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
    const minuteInfo: GroupMinuteInfo = {
      ...this.formGroup.value,
      start: new Date(`${meetingDate}T${startTime}:00`),
      end: new Date(`${meetingDate}T${endTime}:00`),
      group: this.groupDetail?.value as NetworkGroups,
    };
    delete minuteInfo.createdAt;
    this.onCreate.emit(minuteInfo);
  }
}
