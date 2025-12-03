
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import tippy from 'tippy.js';

import { AuthService } from '../../../../../../services/auth/auth.service';
import { Role } from '../../../../../../services/intranet/user/user.interfaces';
import { AppLanguage } from '../../../../../../services/shared/lang/lang.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { MinutesDirectLink } from '../../../../../../services/shared/misc/direct-links.interfaces';
import labels from './minutes-initial-page.language';

@Component({
  standalone: true,
  selector: 'app-minutes-initial-page',
  templateUrl: './minutes-initial-page.component.html',
  imports: [RouterLink],
})
export class MinutesInitialPage implements OnInit {
  public directLinks: MinutesDirectLink[] = [];

  public constructor(
    private title: Title,
    private authService: AuthService,
    private langService: LangService,
    private toastService: ToastrService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(this.labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(this.labels.pageTitle[lang]);
      this.setUpTooltips(lang);
    });
    this.setUpDirectLinks();
    this.authService.activeRole$.subscribe((role) => {
      this.setUpDirectLinks();
    });
  }

  public get labels() {
    return labels;
  }

  private setUpDirectLinks() {
    this.directLinks = [
      {
        id: '0',
        label: {
          es: 'Actas del Grupo Coordinador',
          en: ' Coordinating Group Minutes',
        },
        // icon: 'bx bxs-megaphone',
        route: '/intranet/actas/grupo-coordinador',
        description: {
          es: 'Crea o visualiza las actas del grupo coordinador.',
          en: 'Create or view the minutes of the coordinating group.',
        },
        display: this.displayItem([
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_COORDINATOR,
          Role.ROLE_OPERATIONAL_COORDINATOR,
        ]),
      },
      {
        id: '1',
        label: {
          es: 'Actas del Grupo Facilitador',
          en: 'Facilitating Group Minutes',
        },
        // icon: 'bx bx-notepad',
        route: '/intranet/actas/grupo-facilitador',
        description: {
          es: 'Crea o visualiza las actas del grupo facilitador.',
          en: 'Create or view the minutes of the facilitating group.',
        },
        display: this.displayItem([
          Role.ROLE_SUPER_ADMIN,
          Role.ROLE_FACILITATOR,
          Role.ROLE_OPERATIONAL_COORDINATOR,
        ]),
      },
      {
        id: '2',
        label: { es: 'Actas por comisión', en: 'Commission minutes' },
        // icon: 'bx bx-calendar-event',
        route: '/intranet/actas/comisiones',
        description: {
          es: 'Crea o visualiza las actas por comisión.',
          en: 'Create or view the minutes by commission.',
        },
        display: this.displayItem([
          // All roles allowed
        ]),
      },
    ].filter((link) => link.display);
  }

  private setUpTooltips(lang?: AppLanguage) {
    let itemsDivList = document.querySelectorAll<HTMLElement>(
      '.certificate_card_link',
    );

    itemsDivList.forEach((item) => {
      const id = item.id;
      const link = this.directLinks.find((link) => link.id === id)!;
      return tippy(item, {
        content: link.description[lang || this.lang], // Tooltip content
        placement: 'top', // Tooltip position (top, bottom, left, right, etc.)
      });
    });
  }

  public get lang() {
    return this.langService.language;
  }

  public displayItem(allowedRoles: Role[]): boolean {
    const { userInfo } = this.authService;
    if (!allowedRoles || allowedRoles.length === 0) return true;

    const userAllowed = allowedRoles.some((role) =>
      userInfo?.roles.map(({ role }) => role).includes(role),
    );

    if (!userAllowed) {
      return false;
    }
    const isActiveRoleAllowed = allowedRoles.some(
      (role) => role === this.authService.activeRole!.role,
    );

    if (!isActiveRoleAllowed) {
      return false;
    }
    return true;
  }
}
