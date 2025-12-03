
import { Component, Input, OnInit } from '@angular/core';

import { lastValueFrom } from 'rxjs';

import { AuthService } from '../../../../../../../../services/auth/auth.service';
import { CommissionDetail } from '../../../../../../../../services/intranet/commissions/commissions.interfaces';
import { CommissionsService } from '../../../../../../../../services/intranet/commissions/commissions.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import labels from './commissions-members-modal.lang';

@Component({
  standalone: true,
  selector: 'app-commission-members-modal',
  templateUrl: './commission-members-modal.component.html',
  imports: [],
})
export class CommissionMembersModalComponent implements OnInit {
  @Input() public activeCommission!: CommissionDetail;

  public members: {
    count: number;
    list: { id: string; userId: string }[];
  } = { count: 0, list: [] };

  public membersInfo: {
    id: string;
    browserUrl: string;
    name?: string;
  }[] = [];

  public filteredMembersInfo: {
    id: string;
    browserUrl: string;
    name?: string;
  }[] = [];
  public loading = true;

  public constructor(
    private langService: LangService,
    private commissionsService: CommissionsService,
    private authService: AuthService,
    private resourcesService: ResourcesService,
  ) {}

  public ngOnInit(): void {
    this.loading = true;
    this.commissionsService
      .fetchAllMembersOfCommission(this.activeCommission.value)
      .subscribe((members) => this.fetchUserAvatars(members));
  }

  private fetchUserAvatars(membersInfo: { id: string; name: string }[]) {
    return Promise.all(
      membersInfo.map(({ id, name }) =>
        lastValueFrom(this.resourcesService.getUserAvatarImageByUserId(id))
          .then((blob) => ({ id, name, content: blob }))
          .then(({ id, name, content }) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              let browserUrl = '';
              if (content.size > 0) {
                browserUrl = reader.result as string;
              }
              this.membersInfo.push({ id, name, browserUrl });
            };
            reader.readAsDataURL(content);
          }),
      ),
    ).then(() => {
      this.loading = false;
      this.filteredMembersInfo = this.membersInfo;
    });
  }

  public get labels() {
    return labels;
  }

  public handleSearch(event: KeyboardEvent) {
    const value = (event.target as HTMLInputElement).value.trim();
    if (!value) {
      this.filteredMembersInfo = this.membersInfo;
      return;
    }
    this.filteredMembersInfo = this.membersInfo.filter(({ name }) =>
      name?.toLowerCase().includes(value.toLowerCase()),
    );
  }

  public get lang() {
    return this.langService.language;
  }
}
