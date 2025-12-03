
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ToastrModule, ToastrService } from 'ngx-toastr';

import {
  ConvocationCreateInfo,
  ConvocationPoster,
} from '../../../../../../services/landing/convocation/convocation.interfaces';
import { ConvocationService } from '../../../../../../services/landing/convocation/convocation.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { CreateConvocationComponent } from './components/create-convocation/create-convocation.component';
import { ListConvocationsComponent } from './components/list-convocations/list-convocations.component';
import labels from './convocations-management-page.language';

@Component({
  standalone: true,
  templateUrl: './convocations-management-page.component.html',
  imports: [
    ToastrModule,
    ListConvocationsComponent,
    CreateConvocationComponent
],
})
export class ConvocationsManagementPage {
  public activeTabIndex: number = 0;

  @ViewChild('allConvocationsTab')
  public allConvocationsTab!: ElementRef<HTMLLIElement>;
  public convocationToEdit: ConvocationPoster | undefined;

  public constructor(
    private title: Title,
    private langService: LangService,
    private toastService: ToastrService,
    private convocationService: ConvocationService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });
  }

  public handleRedirectToConvocationsTab() {
    this.allConvocationsTab.nativeElement.click();
    this.activeTabIndex = 1;
  }

  public changeActiveTab(index: number): void {
    if (index === 0 && this.convocationToEdit) {
      this.convocationToEdit = undefined;
    }
    this.activeTabIndex = index;
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleEditConvocation(convocation: ConvocationPoster) {
    this.convocationToEdit = convocation;
    this.changeActiveTab(1);
  }

  public submitConvocation(convocationInfo: ConvocationCreateInfo) {
    if (this.convocationToEdit) {
      return this.convocationService
        .updateConvocation(convocationInfo)
        .subscribe({
          next: (value) => {
            this.toastService.success(
              labels.convocationUpdatedSuccessfully[this.lang],
            );
            this.allConvocationsTab.nativeElement.click();
            this.activeTabIndex = 0;
            this.convocationToEdit = undefined;
          },
          error: (_err) => {
            this.toastService.error(
              this.labels.errorUpdatingConvocation[this.lang],
            );
          },
        });
    }

    return this.convocationService
      .createConvocation(convocationInfo)
      .subscribe({
        next: (value) => {
          this.toastService.success(
            labels.convocationCreatedSuccessfully[this.lang],
          );
          this.allConvocationsTab.nativeElement.click();
          this.activeTabIndex = 0;
        },
        error: (_err) => {
          this.toastService.error(
            this.labels.errorCreatingConvocation[this.lang],
          );
        },
      });
  }

  public handleCancelUpdate() {
    this.toastService.info(labels.updateCancelled[this.lang]);
    this.convocationToEdit = undefined;
    this.changeActiveTab(0);
    this.allConvocationsTab.nativeElement.click();
  }
}
