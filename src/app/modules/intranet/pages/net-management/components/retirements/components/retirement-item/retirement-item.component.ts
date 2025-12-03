import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';

import { AuthService } from '../../../../../../../../services/auth/auth.service';
import { LinkingService } from '../../../../../../../../services/intranet/linking/linking.service';
import { NetworkRetirement } from '../../../../../../../../services/intranet/net-management/net-management.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { RetirementItemDetailComponent } from '../retirement-item-detail/retirement-item-detail.component';
import labels from './retirement-item.lang';

@Component({
  standalone: true,
  selector: 'app-retirement-item',
  templateUrl: './retirement-item.component.html',
  imports: [RetirementItemDetailComponent, CommonModule],
})
export class RetirementItemComponent implements OnInit {
  @Input() public retirement!: NetworkRetirement;
  @Output() public onConfirmed: EventEmitter<void> = new EventEmitter();
  @Output() public onDenied: EventEmitter<void> = new EventEmitter();
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

  public handleConfirmRetirement() {
    return this.authService
      .confirmRetirement(this.retirement.userId)
      .then(() => {
        this.toastService.success(labels.successConfirmRetirement[this.lang]);
        this.onConfirmed.emit();
      })
      .catch(() => {
        this.toastService.error(labels.errorConfirmRetirement[this.lang]);
      });
  }

  public handleDenyRetirement() {
    return this.authService
      .denyRetirement(this.retirement.userId)
      .then(() => {
        this.toastService.success(labels.successDenyRetirement[this.lang]);
        this.onDenied.emit();
      })
      .catch(() => {
        this.toastService.error(labels.errorUnlockUser[this.lang]);
      });
  }

  public handleFetchPdf() {
    this.loadingDocument = true;
    this.errorDocument = false;
    lastValueFrom(
      this.linkingService.fetchUserRetirementPdf(this.retirement.userId),
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
    const parsedDate = new Date(dateString);

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
