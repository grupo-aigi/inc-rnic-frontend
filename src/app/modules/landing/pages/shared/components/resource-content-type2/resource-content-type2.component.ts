
import { Component, Input, OnInit } from '@angular/core';

import { ResourceContentType2 } from '../../../../../../services/shared/contents/contents.interfaces';

@Component({
  standalone: true,
  selector: 'app-resource-content-type2',
  templateUrl: './resource-content-type2.component.html',
  imports: [],
})
export class ResourceContentType2Component implements OnInit {
  @Input({ alias: 'content', required: true }) public contentString!: string;
  public content!: ResourceContentType2;

  public constructor() {}

  public ngOnInit(): void {
    this.content = JSON.parse(this.contentString) as ResourceContentType2;
  }
}
