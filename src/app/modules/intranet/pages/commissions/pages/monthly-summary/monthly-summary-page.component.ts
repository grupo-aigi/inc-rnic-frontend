import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';

import {
  CommissionDetail,
  Commissions,
} from '../../../../../../services/intranet/commissions/commissions.interfaces';
import { CommissionsService } from '../../../../../../services/intranet/commissions/commissions.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { CommissionMembersModalComponent } from './components/commission-members-modal/commission-members-modal.component';
import { CommissionMonthlyMembersComponent } from './components/commission-monthly-members/commission-monthly-members.component';
import labels from './monthly-summary-page.lang';
import commissions from '../../../../../../services/intranet/commissions/commissions.data';

@Component({
  standalone: true,
  templateUrl: './monthly-summary-page.component.html',
  imports: [
    CommonModule,
    CommissionMonthlyMembersComponent,
    CommissionMembersModalComponent,
  ],
})
export class MonthlyStatementPage implements OnInit {
  public years: number[] = [];
  public activeYears: number[] = [];
  public loadingYears: boolean = true;
  private subject = new Subject<{ filter: boolean; value: string }>();
  public activeSearch$ = this.subject.asObservable();
  public commissionsMap: Map<string, CommissionDetail> = new Map();
  public activeCommission: CommissionDetail | undefined;

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private langService: LangService,
    private commissionsService: CommissionsService,
  ) {}

  public ngOnInit(): void {
    if (this.activeCommission) {
      this.title.setTitle(
        this.activeCommission.label[this.lang] + labels.pageTitle[this.lang],
      );

      this.langService.language$.subscribe((lang) => {
        if (this.activeCommission) {
          this.title.setTitle(
            this.activeCommission.label[this.lang] + labels.pageTitle[lang],
          );
        }
      });
    }

    this.route.params.subscribe(({ name }) => {
      this.commissionsMap = new Map<string, CommissionDetail>();
      this.initCommissionsMap();
      this.activeCommission = this.commissionsMap.get(name);
      if (!this.activeCommission) {
        this.router.navigate(['/intranet/comisiones']);
        return;
      }
      this.loadingYears = true;
      this.commissionsService
        .fetchAllYearsByCommission(this.activeCommission.value)
        .subscribe((years) => {
          this.years = years;
          this.loadingYears = false;
        });
    });
  }

  public handleSearch(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    const value = (event.target as HTMLInputElement).value.trim();
    if (!value) {
      this.subject.next({ filter: false, value: '' });
      // this.activeYears = [];
      return;
    }
    //Active all years
    this.activeYears = this.years;
    this.subject.next({ filter: true, value });
  }

  public get labels() {
    return labels;
  }

  public get commissions() {
    return commissions;
  }

  private initCommissionsMap() {
    this.commissionsMap.set(
      'comision-diseno-mision-cancer',
      this.commissions.find(
        ({ value }) => value === Commissions.COMISION_DISENO_MISION_CANCER,
      )!,
    );

    this.commissionsMap.set(
      'comision-formulacion-proyectos',
      this.commissions.find(
        ({ value }) => value === Commissions.COMISION_FORMULACION_PROYECTOS,
      )!,
    );

    this.commissionsMap.set(
      'comision-organizacion-eventos',
      this.commissions.find(
        ({ value }) => value === Commissions.COMISION_ORGANIZACION_EVENTOS,
      )!,
    );
  }

  public get lang() {
    return this.langService.language;
  }

  public isYearActive(year: number): boolean {
    return this.activeYears.includes(year);
  }

  public handleClickOnSearch(event: Event) {
    event.stopPropagation();
    event.preventDefault();
  }

  public handleToggleYear(year: number) {
    if (this.isYearActive(year)) {
      this.activeYears = this.activeYears.filter((y) => y !== year);
    } else {
      this.activeYears.push(year);
    }
  }
}
