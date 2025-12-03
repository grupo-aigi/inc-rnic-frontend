import { Component, OnInit } from '@angular/core';
import {
  DomSanitizer,
  SafeResourceUrl,
  Title,
} from '@angular/platform-browser';

import { LangService } from '../../../../services/shared/lang/lang.service';
import labels from './transformative-missions-page.lang';

@Component({
  standalone: true,
  templateUrl: './transformative-missions-page.component.html',
  imports: [],
})
export class TransformativeMissionsPage implements OnInit {
  public pdfUrl: SafeResourceUrl = '';

  public constructor(
    private title: Title,
    private langService: LangService,
    private sanitizer: DomSanitizer,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `assets/pdf/Lineamientos-Red-2023-${this.lang}.pdf`,
    );
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }
}
