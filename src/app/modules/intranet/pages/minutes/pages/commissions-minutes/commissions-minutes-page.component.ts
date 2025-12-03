
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../../../../services/auth/auth.service';
import { CommissionMinutesService } from '../../../../../../services/intranet/minutes/commission-minute.service';
import { CommissionMinuteInfo } from '../../../../../../services/intranet/minutes/minutes.interfaces';
import { Role } from '../../../../../../services/intranet/user/user.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './commissions-minutes-page.language';
import { CreateCommissionMinuteComponent } from './components/create-commission-minute/create-commission-minute.component';
import { CommissionsMinutesListComponent } from './components/list-commissions-minutes/list-commissions-minutes.component';

@Component({
  standalone: true,
  templateUrl: './commissions-minutes-page.component.html',
  imports: [
    CommissionsMinutesListComponent,
    CreateCommissionMinuteComponent
],
})
export class CommissionsMinutesManagementPage implements OnInit {
  public activeTabIndex: number = 0;
  @ViewChild('listMinutesLI') public $listMinutesLI!: ElementRef<HTMLLIElement>;
  public loading: boolean = true;
  public currentPage: number = 0;
  public pageSize: number = 9;
  public minutes: CommissionMinuteInfo[] = [];

  public constructor(
    private title: Title,
    private langService: LangService,
    private authService: AuthService,
    private toastService: ToastrService,
    private commissionMinuteService: CommissionMinutesService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(this.labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(this.labels.pageTitle[lang]);
    });
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public get isFacilitator() {
    return this.authService.activeRole!.role === Role.ROLE_FACILITATOR;
  }

  public createMinute(minuteInfo: CommissionMinuteInfo) {
    return this.commissionMinuteService.createMinute(minuteInfo).subscribe({
      next: (value) => {
        this.toastService.success('Acta creada exitosamente');
        this.$listMinutesLI.nativeElement.click();
        this.activeTabIndex = 0;
      },
      error: (err) => {
        this.toastService.error('Error al crear el acta');
      },
    });
  }

  public changeActiveTab(index: number): void {
    this.activeTabIndex = index;
  }
}
