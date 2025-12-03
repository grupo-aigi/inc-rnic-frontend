import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NewsPoster } from '../../../../../../services/landing/news/news.interfaces';
import { NewsService } from '../../../../../../services/landing/news/news.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';
import labels from './main-news.lang';
import { formatDate } from '../../../../../../helpers/date-formatters';

@Component({
  standalone: true,
  selector: 'app-main-news',
  templateUrl: './main-news.component.html',
  imports: [CommonModule, RouterLink],
})
export class MainNewsComponent {
  public newsPosters: NewsPoster[] = [];
  public loadingNews: boolean = true;
  public newsImages: string[] = [];

  public constructor(
    private newsletterService: NewsService,
    private resourcesService: ResourcesService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.loadingNews = true;
    this.newsletterService
      .fetchMainNews({ pagina: 0, cantidad: 6 })
      .then(({ records }) => {
        this.newsPosters = records;
        this.loadingNews = false;
      });
  }

  public trim(text: string, length: number = 50): string {
    return text.length > length ? text.slice(0, length) + '...' : text;
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('news', name);
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

  public formatNewsDate(date: Date): string {
    return formatDate(date);
  }
}
