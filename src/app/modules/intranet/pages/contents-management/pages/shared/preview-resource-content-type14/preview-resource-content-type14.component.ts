import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import {
  ResourceContent,
  ResourceContentType14,
} from '../../../../../../../services/shared/contents/contents.interfaces';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';
import labels from './preview-resource-content-type14.lang';

@Component({
  standalone: true,
  selector: 'app-preview-resource-content-type14',
  templateUrl: './preview-resource-content-type14.component.html',
  imports: [CommonModule],
})
export class PreviewResourceContentType14Component implements OnChanges {
  @Input() public resource!: ResourceContent;
  @Input() public isFirst!: boolean;
  @Input() public isLast!: boolean;
  @Output() public onMoveUp: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onMoveDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onDelete: EventEmitter<void> = new EventEmitter<void>();
  public resourceContent!: ResourceContentType14;

  public constructor(public langService: LangService) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.resourceContent = this.resource as ResourceContentType14;
  }

  public moveUp() {
    this.onMoveUp.emit();
  }

  public moveDown() {
    this.onMoveDown.emit();
  }

  public handleDeleteResource(event: MouseEvent) {
    event.preventDefault();
    this.onDelete.emit();
  }
}
