import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './current-ncp.lang';
import { NCPInfo } from '../../../../../../../../services/landing/ncp/ncp.interfaces';
import { YouTubePlayer, YouTubePlayerModule } from '@angular/youtube-player';

import { formatDate } from '../../../../../../../../helpers/date-formatters';

@Component({
  standalone: true,
  selector: 'app-current-ncp',
  templateUrl: './current-ncp.component.html',
  imports: [YouTubePlayerModule],
})
export class CurrentNCPComponent {
  @Input() public ncpInfo: NCPInfo | undefined;
  @Input() public ncpImage: string = '';
  public videoId: string = ''; // Set the YouTube video ID dynamically
  public startSeconds: number = 0;
  public loading: boolean = false;

  public constructor(
    private title: Title,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.title[this.lang]);
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public formatDate(updatedAt: Date) {
    return formatDate(updatedAt);
  }
}
