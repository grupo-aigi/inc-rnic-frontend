import { Component, Input, OnInit } from '@angular/core';

import { ResourceContentType9 } from '../../../../../../services/shared/contents/contents.interfaces';

@Component({
  standalone: true,
  selector: 'app-resource-content-type9',
  templateUrl: './resource-content-type9.component.html',
  imports: [],
})
export class ResourceContentType9Component implements OnInit {
  @Input({ alias: 'content', required: true }) public contentString!: string;
  public content!: ResourceContentType9;

  public constructor() {}

  public ngOnInit(): void {
    this.content = JSON.parse(this.contentString) as ResourceContentType9;
  }
}
