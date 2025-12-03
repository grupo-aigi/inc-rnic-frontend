
import { Component, Input, OnInit } from '@angular/core';

import { ResourceContentType4 } from '../../../../../../services/shared/contents/contents.interfaces';

@Component({
  standalone: true,
  selector: 'app-resource-content-type4',
  templateUrl: './resource-content-type4.component.html',
  imports: [],
})
export class ResourceContentType4Component implements OnInit {
  @Input({ alias: 'content', required: true }) public contentString!: string;
  public content!: ResourceContentType4;
  public itemsList1: string[] = [];
  public itemsList2: string[] = [];
  public constructor() {}

  public ngOnInit(): void {
    this.content = JSON.parse(this.contentString) as ResourceContentType4;
    
    if (this.content.items.length === 0) {
      this.itemsList1 = [];
      this.itemsList2 = [];
    } else if (this.content.items.length === 1) {
      this.itemsList1 = this.content.items;
      this.itemsList2 = [];
    } else if (this.content.items.length >= 2) {
      const { length } = this.content.items;
      if (length % 2 === 0) {
        this.itemsList1 = this.content.items.slice(0, length / 2);
        this.itemsList2 = this.content.items.slice(length / 2, length);
      } else {
        this.itemsList1 = this.content.items.slice(0, length / 2 + 1);
        this.itemsList2 = this.content.items.slice(length / 2 + 1, length);
      }
    }
  }
}
