
import { Component, Input, OnInit } from '@angular/core';
import { ResourceContentType1 } from '../../../../../../services/shared/contents/contents.interfaces';

@Component({
  standalone: true,
  selector: 'app-resource-content-type1',
  templateUrl: './resource-content-type1.component.html',
  imports: [],
})
export class ResourceContentType1Component implements OnInit {
  @Input({ alias: 'content', required: true }) public contentString!: string;
  public content!: ResourceContentType1;

  public constructor() {}

  public ngOnInit(): void {
    this.content = JSON.parse(this.contentString) as ResourceContentType1;
  }
}
