
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { formatDate } from '../../../../../../../../helpers/date-formatters';
import {
  GlobalSearchRecommendation,
  SearchSectionType,
} from '../../../../../../../../services/shared/global-search/global-search.interfaces';
import { AppLanguage } from '../../../../../../../../services/shared/lang/lang.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';

@Component({
  standalone: true,
  selector: 'app-global-search-recommendations',
  templateUrl: './global-search-recommendations.component.html',
  imports: [RouterLink],
})
export class GlobalSearchRecommendationsComponent {
  @Input()
  public recommendations!: GlobalSearchRecommendation[];

  public searchSections = [
    {
      type: SearchSectionType.EVENTS,
      label: { es: 'Eventos', en: 'Events' },
    },
    {
      type: SearchSectionType.NEWS,
      label: { es: 'Noticias', en: 'News' },
    },
    {
      type: SearchSectionType.CONVOCATIONS,
      label: { es: 'Convocatorias', en: 'Convocations' },
    },
    {
      type: SearchSectionType.PUBLICATIONS,
      label: { es: 'Publicaciones', en: 'Publications' },
    },
    {
      type: SearchSectionType.MEMORIES,
      label: { es: 'Memorias', en: 'Memories' },
    },
    {
      type: SearchSectionType.MINUTES,
      label: { es: 'Actas', en: 'Minutes' },
    },
    {
      type: SearchSectionType.PROJECTS,
      label: { es: 'Proyectos', en: 'Projects' },
    },
    {
      type: SearchSectionType.LANDING,
      label: { es: 'Público', en: 'Landing' },
    },
    {
      type: SearchSectionType.INTRANET,
      label: { es: 'Intranet', en: 'Intranet' },
    },
  ];

  public constructor(private langService: LangService) {}

  public get lang() {
    return this.langService.language;
  }

  public trim(text: string, length: number = 50): string {
    return text.length > length ? text.slice(0, length) + '...' : text;
  }

  public formatDate(date: Date): string {
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

  public getRecommendationType(type: SearchSectionType, lang: AppLanguage) {
    const searchSection = this.searchSections.find(
      (section) => section.type === type,
    );
    const label = searchSection!.label[lang];
    // Capitalize the first letter of the type
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
}
