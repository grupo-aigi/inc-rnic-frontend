
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { SupporterService } from '../../../../../../services/landing/supporters/supporters.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { CreateSupporterComponent } from './components/create-supporter/create-supporter.component';
import { ListSupportersComponent } from './components/list-supporters/list-supporters.component';
import labels from './supporters-management-page.language';
import { SupporterInfo } from '../../../../../../services/landing/supporters/supporters.interfaces';

@Component({
  standalone: true,
  templateUrl: './supporters-management-page.component.html',
  imports: [CreateSupporterComponent, ListSupportersComponent],
})
export class SupportersManagementPage {
  public activeTabIndex: number = 0;
  @ViewChild('tab0Element') public tab0Element!: ElementRef<HTMLLIElement>;

  public constructor(
    private langService: LangService,
    private title: Title,
    private supporterService: SupporterService,
    private toastService: ToastrService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });
  }

  public changeActiveTab(index: number): void {
    this.activeTabIndex = index;
  }

  public handleCreateSupporter(supporter: SupporterInfo) {
    return this.supporterService.createSupporter(supporter).subscribe(() => {
      this.toastService.success(
        'Se ha creado el colaborador de La Red exitosamente',
        'Puede ver el colaborador en la sección principal',
      );
      this.tab0Element.nativeElement.click();
      this.activeTabIndex = 0;
    });
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }
}
