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

import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './disable-account-popup.lang';


export enum DisableAccountType {
  DISABLE_TEMPORALLY = 'TEMPORAL',
  DISABLE_DEFINITELY = 'DEFINITIVO',
}

@Component({
  standalone: true,
  selector: 'app-disable-account-popup',
  templateUrl: './disable-account-popup.component.html',
  imports: [ReactiveFormsModule],
})
export class DisableAccountPopupComponent {
  @Output() public onSelectDisableType: EventEmitter<DisableAccountType> =
    new EventEmitter();
  @ViewChild('closeDeactivateAccountModal')
  public closePopupButton!: ElementRef<HTMLButtonElement>;

  public formGroup: FormGroup = this.formBuilder.group({
    disableType: ['', [Validators.required]],
  });

  public constructor(
    private formBuilder: FormBuilder,
    private langService: LangService,
  ) {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public handleSubmit() {
    this.closePopupButton.nativeElement.click();
    const disableType = this.formGroup.get('disableType')
      ?.value as DisableAccountType;
    setTimeout(() => {
      this.onSelectDisableType.emit(disableType);
    }, 1000);
  }
}
