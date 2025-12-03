import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ConvocationPoster } from '../../../../../../services/landing/convocation/convocation.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';
import labels from './current-convocation-summary.lang';
import { formatDate } from '../../../../../../helpers/date-formatters';

@Component({
  standalone: true,
  selector: 'app-current-convocation-summary',
  templateUrl: './current-convocation-summary.component.html',
  imports: [CommonModule],
})
export class CurrentConvocationSummaryComponent {
  @Input() convocationDetail!: ConvocationPoster;

  public constructor(
    private resourcesService: ResourcesService,

    private langService: LangService,
  ) {}

  public getImageUrlByName() {
    return this.resourcesService.getImageUrlByName(
      'convocations',
      this.convocationDetail!.imageName,
    );
  }

  public getFileUrlByName(filename: string, index: number) {
    const originalFilename = `${this.convertTitleToSlug(
      this.convocationDetail.title,
    )}-archivo-${index + 1}.pdf`;
    return this.resourcesService.getFileUrlByName(
      'convocations',
      filename,
      originalFilename,
    );
  }

  private convertTitleToSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/ /g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  public formatDate(date: Date) {
    return formatDate(date);
  }

  public wordToHexColor(word: string) {
    // Calculate a simple hash code for the word
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = word.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert the hash code to a 24-bit hex color
    const color = (hash & 0x00ffffff).toString(16).toUpperCase();

    // Pad the color with zeros if it's less than 6 characters long
    return '#' + '0'.repeat(6 - color.length) + color;
  }

  public getFileExtension(filename: string) {
    return filename.split('.').pop()?.toUpperCase();
  }

  public getFileSize(bytes: number): string {
    if (bytes / 1000000000 > 1) return `${(bytes / 1000000000).toFixed(2)} GB`;
    if (bytes / 1000000 > 1) return `${(bytes / 1000000).toFixed(2)} MB`;
    if (bytes / 1000 > 1) return `${(bytes / 1000).toFixed(2)} KB`;
    return '';
  }

  public get lang() {
    return this.langService.language;
  }
  public get labels() {
    return labels;
  }
}
