import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import {
  ResourceContent,
  ResourceContentType11,
} from '../../../../../../../services/shared/contents/contents.interfaces';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';
import labels from './preview-resource-content-type11.lang';

@Component({
  standalone: true,
  selector: 'app-preview-resource-content-type11',
  templateUrl: './preview-resource-content-type11.component.html',
  imports: [CommonModule, YouTubePlayerModule],
})
export class PreviewResourceContentType11Component implements OnChanges {
  @Input() public resource!: ResourceContent;
  @Input() public isFirst!: boolean;
  @Input() public isLast!: boolean;
  @Output() public onMoveUp: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onMoveDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onDelete: EventEmitter<void> = new EventEmitter<void>();
  public resourceContent!: ResourceContentType11;

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
    this.resourceContent = this.resource as ResourceContentType11;
  }

  public moveUp() {
    this.onMoveUp.emit();
  }

  public moveDown() {
    this.onMoveDown.emit();
  }

  public getYoutubeLinkId(link: string): string {
    return link.split('v=')[1];
  }

  public handleDeleteResource(event: MouseEvent) {
    event.preventDefault();
    this.onDelete.emit();
  }
}
