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
  ResourceContentType9,
} from '../../../../../../../services/shared/contents/contents.interfaces';
import labels from './preview-resource-content-type9.lang';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../services/shared/resources/resource.service';

@Component({
  standalone: true,
  selector: 'app-preview-resource-content-type9',
  templateUrl: './preview-resource-content-type9.component.html',
  imports: [CommonModule],
})
export class PreviewResourceContentType9Component implements OnChanges {
  @Input() public resource!: ResourceContent;
  @Input() public isFirst!: boolean;
  @Input() public isLast!: boolean;
  @Output() public onMoveUp: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onMoveDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onDelete: EventEmitter<void> = new EventEmitter<void>();
  public resourceContent!: ResourceContentType9;

  public constructor(public langService: LangService) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.resourceContent = this.resource as ResourceContentType9;
  }

  public ngOnInit(): void {}

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
