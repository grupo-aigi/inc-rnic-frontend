import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { YouTubePlayerModule } from '@angular/youtube-player';

import { MemoryInfo } from '../../../../../../services/landing/memories/memories.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './memory-item.lang';

@Component({
  standalone: true,
  selector: 'app-memory-item',
  templateUrl: './memory-item.component.html',
  imports: [YouTubePlayerModule, CommonModule],
})
export class MemoryItemComponent {
  @Input() public memoryPoster!: MemoryInfo;
  @Input() public activeMemory: MemoryInfo | null = null;
  @Output() public onActive: EventEmitter<number> = new EventEmitter();

  public constructor(private langService: LangService) {}

  public handleToggleActiveMemory(id: number) {
    this.onActive.emit(id);
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }
}
