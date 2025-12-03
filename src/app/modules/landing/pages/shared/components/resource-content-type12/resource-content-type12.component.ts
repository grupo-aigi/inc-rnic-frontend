import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


import { ResourceContentType12 } from '../../../../../../services/shared/contents/contents.interfaces';

@Component({
  standalone: true,
  selector: 'app-resource-content-type12',
  templateUrl: './resource-content-type12.component.html',
  imports: [],
})
export class ResourceContentType12Component implements OnInit {
  @Input({ alias: 'content', required: true }) public contentString!: string;
  public content!: ResourceContentType12;
  public mapUrl: SafeResourceUrl = '';
  public constructor(public sanitizer: DomSanitizer) {}

  public ngOnInit(): void {
    this.content = JSON.parse(this.contentString) as ResourceContentType12;
    const { mapLink } = this.content;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapLink);
  }
}
