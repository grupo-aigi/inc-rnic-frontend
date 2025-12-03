import { Component, OnInit } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { YouTubePlayerModule } from '@angular/youtube-player';

import { ToastrService } from 'ngx-toastr';

import { NCPInfo } from '../../../../services/landing/ncp/ncp.interfaces';
import { NCPService } from '../../../../services/landing/ncp/ncp.service';
import { LangService } from '../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../services/shared/resources/resource.service';
import labels from './national-contact-point-page.lang';

@Component({
  standalone: true,
  templateUrl: './national-contact-point-page.component.html',
  imports: [YouTubePlayerModule],
})
export class NationalContactPointPage implements OnInit {
  public videoId: string = '';
  public ncpInfo: NCPInfo | undefined;
  public loading: boolean = true;

  public constructor(
    private title: Title,
    private langService: LangService,
    private ncpService: NCPService,
    private toastService: ToastrService,
    private resourcesService: ResourcesService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });
    this.loading = true;
    this.ncpService
      .getNationalContactPoint()
      .then((ncpInfo) => {
        this.ncpInfo = ncpInfo;
      })
      .catch((err) => {
        this.toastService.warning(
          'No se ha podido obtener la obtener la información del NCP, posiblemente no existe.',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  public getLastUpdatedAt(updatedAt: Date, lang: string) {
    const parsedDate = new Date(updatedAt);
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    return parsedDate.toLocaleDateString(lang, options);
  }

  public get labels() {
    return labels;
  }

  public get ncpImage() {
    if (!this.ncpInfo) return '';
    return this.resourcesService.getImageUrlByName(
      'ncp',
      this.ncpInfo.imageName,
    );
  }

  public get lang() {
    return this.langService.language;
  }
}
