import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../../services/auth/auth.service';
import { Role } from '../../../../services/intranet/user/user.interfaces';
import { LangService } from '../../../../services/shared/lang/lang.service';
import { ApprovalLetterComponent } from './components/approval-letter/approval-letter.component';
import { LinkingCertificateComponent } from './components/linking-certificate/linking-certificate.component';
import { MyLinkingComponent } from './components/my-linking/my-linking.component';
import { NetCarnetComponent } from './components/net-carnet/net-carnet.component';
import labels from './linking-page.language';

@Component({
  standalone: true,
  templateUrl: './linking-page.component.html',
  imports: [
    CommonModule,
    MyLinkingComponent,
    LinkingCertificateComponent,
    ApprovalLetterComponent,
    NetCarnetComponent,
  ],
})
export class LinkingPage implements OnInit {
  public activeTabIndex: number = 0;

  public constructor(
    private title: Title,
    private langService: LangService,
    private authService: AuthService,
    private toastService: ToastrService,
  ) {}

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });
    this.showToastMessage();
  }

  public get isRegistered() {
    return this.authService.userInfo?.roles
      .map(({ role }) => role)
      .includes(Role.ROLE_REGISTERED);
  }
  public get isLinked() {
    return this.authService.userInfo?.roles
      .map(({ role }) => role)
      .includes(Role.ROLE_LINKED);
  }

  public get userInfo() {
    return this.authService.userInfo;
  }

  public changeActiveTab(index: number): void {
    this.activeTabIndex = index;
    this.showToastMessage();
  }
  private showToastMessage() {
    const { currentlyActive } = this.toastService;
    if (currentlyActive) {
      this.toastService.clear();
    }
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.toastService.clear();
        this.toastService.info(
          'Tenga en cuenta que la contraseña solicitada es su documento de identidad',
          'Información',
          {
            timeOut: 20000,
          },
        );
        resolve();
      }, 1000);
    });
  }
}
