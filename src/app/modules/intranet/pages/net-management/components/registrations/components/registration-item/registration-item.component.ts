import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';

import { AuthService } from '../../../../../../../../services/auth/auth.service';
import { LinkingService } from '../../../../../../../../services/intranet/linking/linking.service';
import { NetworkRegistration } from '../../../../../../../../services/intranet/net-management/net-management.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { RegistrationItemDetailComponent } from '../registration-item-detail/registration-item-detail.component';
import labels from './registration-item.lang';

@Component({
  standalone: true,
  selector: 'app-registration-item',
  templateUrl: './registration-item.component.html',
  imports: [CommonModule, RegistrationItemDetailComponent],
})
export class RegistrationItemComponent implements OnInit {
  @Input() public registration!: NetworkRegistration;
  @Output() public onLinkingConfirmed: EventEmitter<void> = new EventEmitter();
  public showDetail = false;
  public loadingDocument = false;
  public errorDocument = false;
  public showDocument = false;
  public myLinkingPdfUrl: SafeResourceUrl = '';

  public constructor(
    private langService: LangService,
    private linkingService: LinkingService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private toastService: ToastrService,
  ) {}

  public ngOnInit(): void {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleToggleDetail() {
    this.showDetail = !this.showDetail;
  }

  public handleToggleDocument() {
    this.showDocument = !this.showDocument;
    if (this.showDocument) {
      this.handleFetchPdf();
    } else {
      this.myLinkingPdfUrl = '';
    }
  }

  public handleConfirmLinking() {
    return this.linkingService
      .confirmRegistration(this.registration.id)
      .then(() => {
        this.toastService.success(labels.successConfirmLinking[this.lang]);
        this.onLinkingConfirmed.emit();
      })
      .catch(() => {
        this.toastService.error(labels.errorConfirmLinking[this.lang]);
      });
  }

  public handleLockUser() {
    return lastValueFrom(this.authService.lockUserAccount(this.registration.id))
      .then(() => {
        this.toastService.success(labels.successLockUser[this.lang]);
        this.registration.accountNonLocked = false;
      })
      .catch(() => {
        this.toastService.error(labels.errorLockUser[this.lang]);
      });
  }

  public handleUnlockUser() {
    return lastValueFrom(
      this.authService.unlockUserAccount(this.registration.id),
    )
      .then(() => {
        this.toastService.success(labels.successUnlockUser[this.lang]);
        this.registration.accountNonLocked = true;
      })
      .catch(() => {
        this.toastService.error(labels.errorUnlockUser[this.lang]);
      });
  }

  public handleFetchPdf() {
    this.loadingDocument = true;
    this.errorDocument = false;
    lastValueFrom(
      this.linkingService.fetchUserRegistrationPdf(this.registration.id),
    )
      .then((response) => {
        const pdfData = new Blob([response], {
          type: 'application/pdf',
        });
        this.myLinkingPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          URL.createObjectURL(pdfData),
        );
      })
      .catch((err) => {
        this.errorDocument = true;
      })
      .finally(() => {
        this.loadingDocument = false;
      });
  }

  public formatDate(dateString: string): string {
    const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
    const parsedDate = new Date(
      new Date(dateString).getTime() + timezoneOffsetInMinutes * 60 * 1000,
    );

    const navigatorLanguage =
      this.langService.language === 'es' ? 'es-ES' : 'en-US';

    const options: Intl.DateTimeFormatOptions = {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    };
    return parsedDate.toLocaleDateString(navigatorLanguage, options);
  }
}
