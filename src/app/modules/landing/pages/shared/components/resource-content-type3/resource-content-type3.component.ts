
import { Component, Input, OnInit } from '@angular/core';

import {
  ContentTarget,
  ResourceContentType3,
} from '../../../../../../services/shared/contents/contents.interfaces';
import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';

@Component({
  standalone: true,
  selector: 'app-resource-content-type3',
  templateUrl: './resource-content-type3.component.html',
  imports: [],
})
export class ResourceContentType3Component implements OnInit {
  @Input() public target!: ContentTarget;
  @Input({ alias: 'content', required: true }) public contentString!: string;
  public content!: ResourceContentType3;
  public contentImages: { name: string; browserUrl: string }[] = [];

  public constructor(private resourcesService: ResourcesService) {}

  public ngOnInit(): void {
    this.content = JSON.parse(this.contentString) as ResourceContentType3;
  }

  public getImageUrlByName(imageName: string) {
    return this.resourcesService.getImageUrlByName(this.target, imageName);
  }
}
