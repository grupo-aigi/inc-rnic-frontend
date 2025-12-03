import { Component, Input, OnInit } from '@angular/core';

import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';

import { ResourceContentType13 } from '../../../../../../services/shared/contents/contents.interfaces';
import labels from './resource-content-type13.lang';
import { LangService } from '../../../../../../services/shared/lang/lang.service';

@Component({
  standalone: true,
  selector: 'app-resource-content-type13',
  templateUrl: './resource-content-type13.component.html',
  imports: [],
})
export class ResourceContentType13Component implements OnInit {
  @Input({ alias: 'content', required: true }) public contentString!: string;
  public content!: ResourceContentType13;

  public constructor(
    private resourcesService: ResourcesService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.content = JSON.parse(this.contentString) as ResourceContentType13;
  }

  public downloadFile(filename: string, originalFilename: string) {
    return this.resourcesService
      .fetchFileById('events', filename)
      .subscribe((value) => {
        const blob = new Blob([value], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = originalFilename;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  public getFileSize(bytes: number): string {
    if (bytes / 1000000000 > 1) return `${(bytes / 1000000000).toFixed(2)} GB`;
    if (bytes / 1000000 > 1) return `${(bytes / 1000000).toFixed(2)} MB`;
    if (bytes / 1000 > 1) return `${(bytes / 1000).toFixed(2)} KB`;
    return '';
  }

  public get labels() {
    return labels;
  }
  public get lang() {
    return this.langService.language;
  }
}
