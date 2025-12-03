import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-confirm-delete-popup',
  templateUrl: './confirm-delete-popup.component.html',
})
export class ConfirmDeletePopupComponent {
  @Output() onSubmit: EventEmitter<void> = new EventEmitter();
  @ViewChild('closeBtn') closeBtn!: ElementRef<HTMLButtonElement>;

  public constructor() {}

  public handleSubmit() {
    this.onSubmit.emit();
    this.closeBtn.nativeElement.click();
  }
}
