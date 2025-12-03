import { CommonModule } from '@angular/common';
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
  ResourceContent,
  ResourceContentType4,
} from '../../../../../../../services/shared/contents/contents.interfaces';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';
import labels from './preview-resource-content-type4.lang';

@Component({
  standalone: true,
  selector: 'app-preview-resource-content-type4',
  templateUrl: './preview-resource-content-type4.component.html',
  imports: [CommonModule],
})
export class PreviewResourceContentType4Component implements OnInit, OnChanges {
  @Input() public resource!: ResourceContent;
  @Input() public isFirst!: boolean;
  @Input() public isLast!: boolean;
  @Output() public onMoveUp: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onMoveDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onDelete: EventEmitter<void> = new EventEmitter<void>();
  public resourceContent!: ResourceContentType4;

  public itemsList1: string[] = [];
  public itemsList2: string[] = [];

  public constructor(public langService: LangService) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.resourceContent = this.resource as ResourceContentType4;
  }

  public ngOnInit(): void {
    if (this.resourceContent.items.length === 0) {
      this.itemsList1 = [];
      this.itemsList2 = [];
    } else if (this.resourceContent.items.length === 1) {
      this.itemsList1 = this.resourceContent.items;
      this.itemsList2 = [];
    } else if (this.resourceContent.items.length >= 2) {
      const { length } = this.resourceContent.items;
      if (length % 2 === 0) {
        this.itemsList1 = this.resourceContent.items.slice(0, length / 2);
        this.itemsList2 = this.resourceContent.items.slice(length / 2, length);
      } else {
        this.itemsList1 = this.resourceContent.items.slice(0, length / 2 + 1);
        this.itemsList2 = this.resourceContent.items.slice(
          length / 2 + 1,
          length,
        );
      }
    }
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
