import { Component, Input, OnInit } from '@angular/core';


import { ResourceContentType6 } from '../../../../../../services/shared/contents/contents.interfaces';

@Component({
  standalone: true,
  selector: 'app-resource-content-type6',
  templateUrl: './resource-content-type6.component.html',
  imports: [],
})
export class ResourceContentType6Component implements OnInit {
  @Input({ alias: 'content', required: true }) public contentString!: string;

  public content!: ResourceContentType6;

  public constructor() {}

  public ngOnInit(): void {
    this.content = JSON.parse(this.contentString) as ResourceContentType6;
  }
}
