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
  ContentTarget,
  ResourceContent,
  ResourceContentType5,
} from '../../../../../../../services/shared/contents/contents.interfaces';
import { ResourcesService } from '../../../../../../../services/shared/resources/resource.service';
import { LangService } from '../../../../../../../services/shared/lang/lang.service';
import labels from './preview-resource-content-type5.lang';

@Component({
  standalone: true,
  selector: 'app-preview-resource-content-type5',
  templateUrl: './preview-resource-content-type5.component.html',
  imports: [CommonModule],
})
export class PreviewResourceContentType5Component implements OnChanges {
  @Input() public target!: ContentTarget;
  @Input() public resource!: ResourceContent;
  @Input() public isFirst!: boolean;
  @Input() public isLast!: boolean;
  @Output() public onMoveUp: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onMoveDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onDelete: EventEmitter<void> = new EventEmitter<void>();
  public resourceContent!: ResourceContentType5;

  public constructor(
    private resourcesService: ResourcesService,
    public langService: LangService,
  ) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.resourceContent = this.resource as ResourceContentType5;
  }

  public ngOnInit(): void {}

  public moveUp() {
    this.onMoveUp.emit();
  }

  public moveDown() {
    this.onMoveDown.emit();
  }

  public getImageUrlByName(image: string) {
    return this.resourcesService.getImageUrlByName(this.target, image);
  }

  public handleDeleteResource(event: MouseEvent) {
    event.preventDefault();
    this.onDelete.emit();
  }
}
