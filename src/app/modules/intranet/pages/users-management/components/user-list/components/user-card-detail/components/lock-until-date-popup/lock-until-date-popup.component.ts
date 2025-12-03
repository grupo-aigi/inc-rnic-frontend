
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-lock-until-date-popup',
  templateUrl: './lock-until-date-popup.component.html',
  imports: [ReactiveFormsModule],
})
export class LockUntilDatePopupComponent {
  @Output() onSubmit: EventEmitter<Date> = new EventEmitter();
  @ViewChild('closeBtn') closeBtn!: ElementRef<HTMLButtonElement>;
  public formGroup: FormGroup = this.formBuilder.group({
    until: [''],
  });

  public constructor(private formBuilder: FormBuilder) {}

  public isFieldInvalid(fieldName: string): boolean {
    const invalid =
      this.formGroup.get(fieldName)?.errors &&
      this.formGroup.get(fieldName)?.touched;
    return !!invalid;
  }

  public handleSubmit() {
    this.onSubmit.emit(this.formGroup.get('until')?.value);
    this.closeBtn.nativeElement.click();
  }
}
