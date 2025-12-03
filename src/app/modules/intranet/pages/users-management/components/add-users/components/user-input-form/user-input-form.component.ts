
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { UserRegister } from '../../../../../../../../services/auth/auth.interfaces';
import commissions from '../../../../../../../../services/intranet/commissions/commissions.data';
import { Commissions } from '../../../../../../../../services/intranet/commissions/commissions.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './user-input-form.lang';

@Component({
  standalone: true,
  selector: 'app-user-input-form',
  templateUrl: './user-input-form.component.html',
  imports: [ReactiveFormsModule],
})
export class UserInputFormComponent implements OnInit, OnChanges {
  @Input() public registerInfo!: UserRegister;
  @Input() public forceValidate!: boolean;
  @Output() public onDelete: EventEmitter<string> = new EventEmitter();
  @Output() public onSubmit: EventEmitter<string> = new EventEmitter();
  public safePdfUrl: string = '';

  public formGroup: FormGroup = this.formBuilder.group({
    email: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(100)],
    ],
    identification: [
      '',
      [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern(/^[0-9]+$/),
      ],
    ],
    name: ['', [Validators.required, Validators.maxLength(100)]],
    phoneNumber: ['', [Validators.required, Validators.maxLength(20)]],
    commissions: [[]],
    entryDate: ['', [Validators.required, this.dateInPast]],
  });

  public constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastrService,
    private sanitizer: DomSanitizer,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    const url = URL.createObjectURL(this.registerInfo.file);
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      url,
    ) as string;
    this.formGroup.valueChanges.subscribe((value) => {
      this.registerInfo.userInfo = value;
      this.registerInfo.valid = this.formGroup.valid;
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['forceValidate'].currentValue === true &&
      !this.registerInfo.valid
    ) {
      this.formGroup.markAllAsTouched();
    }
  }

  private dateInPast(control: AbstractControl): ValidationErrors | null {
    const deadlineDate = new Date(control.value);
    if (deadlineDate > new Date()) {
      return { dateAfterNow: true };
    }
    return null;
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public get commissions() {
    return commissions;
  }

  public isFieldInvalid(fieldName: string): boolean {
    return !!(
      this.formGroup.get(fieldName)?.errors &&
      this.formGroup.get(fieldName)?.touched
    );
  }

  public handleToggleCommission(event: Event) {
    const inputELement = event.target as HTMLInputElement;
    const value = inputELement.value as Commissions;

    let commissions = (this.formGroup.get('commissions')?.value ||
      []) as Commissions[];

    const commissionAlreadySelected = commissions.includes(value);
    if (!commissionAlreadySelected) {
      commissions = [...commissions, value];
    } else {
      commissions = commissions.filter((commission) => commission !== value);
    }
    this.formGroup.get('commissions')?.setValue(commissions);
  }

  public getFileSize(bytes: number): string {
    if (bytes / 1000000000 > 1) return `${(bytes / 1000000000).toFixed(2)} GB`;
    if (bytes / 1000000 > 1) return `${(bytes / 1000000).toFixed(2)} MB`;
    if (bytes / 1000 > 1) return `${(bytes / 1000).toFixed(2)} KB`;
    return '';
  }

  public handleDeleteRegister() {
    this.onDelete.emit(this.registerInfo.id);
    this.toastService.info(labels.registerDeletedSuccessfully[this.lang]);
  }

  public handleSubmit() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      this.toastService.error(labels.formHasErrors[this.lang]);
      return;
    }
    this.onSubmit.emit(this.registerInfo.id);
  }
}
