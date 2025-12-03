import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import {
  ResourceContent,
  ResourceContentType12,
} from '../../../../../../../services/shared/contents/contents.interfaces';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';
import labels from './preview-resource-content-type12.lang';

@Component({
  standalone: true,
  selector: 'app-preview-resource-content-type12',
  templateUrl: './preview-resource-content-type12.component.html',
  imports: [CommonModule],
})
export class PreviewResourceContentType12Component implements OnChanges {
  @Input() public resource!: ResourceContent;
  @Input() public isFirst!: boolean;
  @Input() public isLast!: boolean;
  @Output() public onMoveUp: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onMoveDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onDelete: EventEmitter<void> = new EventEmitter<void>();
  public resourceContent!: ResourceContentType12;
  public mapUrl: SafeResourceUrl = '';

  public constructor(
    public sanitizer: DomSanitizer,
    public langService: LangService,
  ) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.resourceContent = this.resource as ResourceContentType12;
    const { mapLink } = this.resourceContent;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapLink);
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
