import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { LangService } from '../../../../../../../../../../services/shared/lang/lang.service';
import labels from './delete-scientific-ecosystem-confirmation.lang';

import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-delete-scientific-ecosystem-confirmation',
  templateUrl: './delete-scientific-ecosystem-confirmation.component.html',
  imports: [FormsModule],
})
export class DeleteScientificEcosystemConfirmationComponent {
  @Input() public title!: { en: string; es: string };
  @Output() public onConfirm: EventEmitter<void> = new EventEmitter<void>();
  @Input() public valueToType!: string;
  @ViewChild('closeModalBtn')
  public closeModalBtn!: ElementRef<HTMLButtonElement>;
  public actualValue: string = '';
  public showError: boolean = false;

  public constructor(private langService: LangService) {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public handleConfirmDelete() {
    if (this.actualValue === this.valueToType) {
      this.showError = false;
      this.onConfirm.emit();
      this.actualValue = '';
      this.closeModalBtn.nativeElement.click();
    } else {
      this.showError = true;
    }
  }
}
