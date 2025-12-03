
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ResourceContentType11 } from '../../../../../../services/shared/contents/contents.interfaces';
import { YouTubePlayerModule } from '@angular/youtube-player';

@Component({
  standalone: true,
  selector: 'app-resource-content-type11',
  templateUrl: './resource-content-type11.component.html',
  imports: [YouTubePlayerModule],
})
export class ResourceContentType11Component implements OnInit {
  @Input({ alias: 'content', required: true }) public contentString!: string;
  public content!: ResourceContentType11;

  public constructor(public sanitizer: DomSanitizer) {}

  public ngOnInit(): void {
    this.content = JSON.parse(this.contentString) as ResourceContentType11;
  }

  public getYoutubeLinkId(link: string): string {
    return link.split('v=')[1];
  }
}
