
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { PublicationInfo } from '../../../../../../services/landing/publications/publications.interfaces';
import { PublicationService } from '../../../../../../services/landing/publications/publications.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { CreatePublicationComponent } from './components/create-publication/create-publication.component';
import { ListPublicationsComponent } from './components/list-publications/list-publications.component';
import labels from './publications-management.lang';

@Component({
  standalone: true,
  templateUrl: './publications-management-page.component.html',
  imports: [
    ListPublicationsComponent,
    CreatePublicationComponent
],
})
export class PublicationsManagementPage implements OnInit {
  public activeTabIndex: number = 0;
  @ViewChild('publicationsLI')
  public publicationsLI!: ElementRef<HTMLLIElement>;
  public publicationToEdit: PublicationInfo | undefined;

  public constructor(
    private title: Title,
    private publicationService: PublicationService,
    private langService: LangService,
    private toastService: ToastrService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public changeActiveTab(index: number): void {
    if (index === 0 && this.publicationToEdit) {
      this.publicationToEdit = undefined;
    }
    this.activeTabIndex = index;
  }

  public handleEditPublication(publication: PublicationInfo) {
    this.publicationToEdit = publication;
    this.changeActiveTab(1);
  }

  public submitPublication(publication: PublicationInfo) {
    if (this.publicationToEdit) {
      return this.publicationService.updatePublication(publication).subscribe({
        next: (value) => {
          this.toastService.success(
            labels.publicationUpdatedSuccessfully[this.lang],
          );
          this.publicationsLI.nativeElement.click();
          this.activeTabIndex = 0;
          this.publicationToEdit = undefined;
        },
        error: (_err) => {
          this.toastService.error(
            this.labels.errorUpdatingPublication[this.lang],
            'Error',
          );
        },
      });
    }
    return this.publicationService.createPublication(publication).subscribe({
      next: (value) => {
        this.toastService.success(
          labels.publicationCreatedSuccessfully[this.lang],
        );
        this.publicationsLI.nativeElement.click();
        this.activeTabIndex = 0;
      },
      error: (_err) => {
        this.toastService.error(
          this.labels.errorCreatingPublication[this.lang],
          'Error',
        );
      },
    });
  }
}
