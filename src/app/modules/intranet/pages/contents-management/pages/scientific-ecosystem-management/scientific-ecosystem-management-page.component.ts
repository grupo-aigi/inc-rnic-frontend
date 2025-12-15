import {
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { AnnouncementInfo } from '../../../../../../services/landing/announcements/announcement.interfaces';
import { AnnouncementService } from '../../../../../../services/landing/announcements/announcement.service';
import {
  ScientificEcosystemCreateInfo,
  ScientificEcosystemPoster,
} from '../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { CreateScientificEcosystemComponent } from './components/create-scientific-ecosystem/create-scientific-ecosystem.component';
import { ScientificEcosystemListComponent } from './components/scientific-ecosystem-list/scientific-ecosystem-list.component';
import labels from './scientific-ecosystem-management.lang';
import { ScientificEcosystemCreateService } from '../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem-create.service';

@Component({
  standalone: true,
  templateUrl: './scientific-ecosystem-management-page.component.html',
  imports: [
    ScientificEcosystemListComponent,
    CreateScientificEcosystemComponent,
  ],
})
export class ScientificEcosystemManagementPage implements OnInit {
  public activeTabIndex: number = 0;
  @ViewChild('scientificEcosystemsLI')
  public scientificEcosystemsLI!: ElementRef<HTMLLIElement>;

  @ViewChild('createOrEditEcosystemsLI')
  public createOrEditEcosystemsLI!: ElementRef<HTMLLIElement>;
  public isEditing: boolean = false;

  public constructor(
    private title: Title,
    private langService: LangService,
    private toastService: ToastrService,
    private scientificEcosystemCreateService: ScientificEcosystemCreateService,
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
    this.activeTabIndex = index;
  }

  public handleCancelUpdate() {
    this.toastService.info(labels.updateCancelled[this.lang]);
    this.scientificEcosystemCreateService.resetCreateInfo();
    this.changeActiveTab(0);
    this.scientificEcosystemsLI.nativeElement.click();
  }

  public onFormSubmit() {
    this.activeTabIndex = 0;
    this.scientificEcosystemsLI.nativeElement.click();
  }

  public handleStartEditEcosystem(ecosystem: ScientificEcosystemPoster) {
    this.toastService.info(labels.editingEcosystem[this.lang]);
    this.scientificEcosystemCreateService
      .setScientificEcosystemToEdit(ecosystem)
      .then(() => {
        this.changeActiveTab(1);
        this.createOrEditEcosystemsLI.nativeElement.click();
      });
  }
}
