import { Component, Input, OnInit } from '@angular/core';

import { RouterLink } from '@angular/router';
import { ResourceContentType14 } from '../../../../../../services/shared/contents/contents.interfaces';

@Component({
  standalone: true,
  selector: 'app-resource-content-type14',
  templateUrl: './resource-content-type14.component.html',
  imports: [RouterLink],
})
export class ResourceContentType14Component implements OnInit {
  @Input({ alias: 'content', required: true }) public contentString!: string;
  public content!: ResourceContentType14;

  public constructor() {}
  
  public ngOnInit(): void {
    this.content = JSON.parse(this.contentString) as ResourceContentType14;
  }
}
