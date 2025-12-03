
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../../../../services/auth/auth.service';
import { GroupMinutesService } from '../../../../../../services/intranet/minutes/group-minute.service';
import { GroupMinuteInfo } from '../../../../../../services/intranet/minutes/minutes.interfaces';
import { Role } from '../../../../../../services/intranet/user/user.interfaces';
import {
  NetworkGroupDetail,
  NetworkGroups,
} from '../../../../../../services/shared/groups/groups.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { CreateGroupMinuteComponent } from './components/create-groups-minute/create-groups-minute.component';
import { GroupsMinutesListComponent } from './components/list-groups-minutes/list-groups-minutes.component';
import labels from './groups-minutes-page.language';
import { networkGroups } from '../../../../../../services/shared/groups/groups.data';

@Component({
  standalone: true,
  templateUrl: './groups-minutes-page.component.html',
  imports: [
    RouterModule,
    GroupsMinutesListComponent,
    CreateGroupMinuteComponent
],
})
export class GroupsMinutesManagementPage implements OnInit {
  public activeTabIndex: number = 0;
  @ViewChild('listMinutesLI') public $listMinutesLI!: ElementRef<HTMLLIElement>;
  public loading: boolean = true;
  public currentPage: number = 0;
  public pageSize: number = 9;
  public minutes: GroupMinuteInfo[] = [];
  public isAllowedToCreate: boolean = false;
  public group: NetworkGroupDetail | undefined;
  public networkGroup: NetworkGroups | undefined;

  public constructor(
    private title: Title,
    private langService: LangService,
    public authService: AuthService,
    private toastService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private groupMinuteService: GroupMinutesService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(this.labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(this.labels.pageTitle[lang]);
    });
    this.route.url.subscribe((url) => {
      const { path: groupPath } = url[0];

      if (
        groupPath !== 'grupo-coordinador' &&
        groupPath !== 'grupo-facilitador'
      ) {
        this.toastService.error('Grupo no encontrado');
        this.router.navigate(['/intranet/actas']);
        return;
      }

      const isAllowed =
        this.authService.activeRole!.role === Role.ROLE_OPERATIONAL_COORDINATOR;

      if (isAllowed) {
        this.isAllowedToCreate = true;
      }

      if (groupPath === 'grupo-coordinador') {
        this.networkGroup = NetworkGroups.COORDINATING;
      } else {
        this.networkGroup = NetworkGroups.FACILITATING;
      }

      this.initGroup(groupPath);
    });
  }

  private initGroup(groupPath: string) {
    if (groupPath === 'grupo-coordinador') {
      this.group = networkGroups.find(
        ({ value }) => value === NetworkGroups.COORDINATING,
      );
    } else if (groupPath === 'grupo-facilitador') {
      this.group = networkGroups.find(
        ({ value }) => value === NetworkGroups.FACILITATING,
      );
    }
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public createMinute(minuteInfo: GroupMinuteInfo) {
    return this.groupMinuteService.createMinute(minuteInfo).subscribe({
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
