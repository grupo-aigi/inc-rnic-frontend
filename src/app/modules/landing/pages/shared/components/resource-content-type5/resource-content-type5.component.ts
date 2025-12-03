import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import {
  ContentTarget,
  ResourceContentType5,
} from '../../../../../../services/shared/contents/contents.interfaces';
import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';

@Component({
  standalone: true,
  selector: 'app-resource-content-type5',
  templateUrl: './resource-content-type5.component.html',
  imports: [CommonModule],
})
export class ResourceContentType5Component implements OnInit {
  @Input() public target!: ContentTarget;
  @Input({ alias: 'content', required: true }) public contentString!: string;
  public content!: ResourceContentType5;
  public itemsList: { index: number; active: boolean }[] = [];

  public constructor(private resourcesService: ResourcesService) {}

  public ngOnInit(): void {
    this.content = JSON.parse(this.contentString) as ResourceContentType5;

    this.itemsList = this.content.items.map((_item, index) => ({
      index,
      active: false,
    }));
  }

  public handleToggleItem(i: number) {
    this.itemsList[i].active = !this.itemsList[i].active;
  }

  public isItemActive(i: number) {
    return this.itemsList[i].active;
  }

  public getImageUrlByName(imageName: string) {
    return this.resourcesService.getImageUrlByName(this.target, imageName);
  }
}
