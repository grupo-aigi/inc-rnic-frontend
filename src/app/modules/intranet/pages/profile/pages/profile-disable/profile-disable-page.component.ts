import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../../../../services/auth/auth.service';
import { UsersService } from '../../../../../../services/intranet/user/user.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { DisableAccountType } from '../../components/disable-account-popup/disable-account-popup.component';
import labels from './profile-disable-page.language';

@Component({
  standalone: true,
  selector: 'app-profile-disable-page',
  templateUrl: './profile-disable-page.component.html',
  styleUrls: ['./profile-disable-page.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProfileDisablePage implements OnInit {
  public printingPDF: boolean = false;

  public signature: string | ArrayBuffer | null = null;
  public generatedPdfFile: File | null = null;

  public formGroup: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    city: ['', [Validators.required]],
    id: ['', [Validators.required]],
    issuedIn: ['', [Validators.required]],
    reason: ['', [Validators.required]],
    disableType: ['', [Validators.required]],
    signature: [null, [Validators.required]],
    signatureCity: ['', [Validators.required]],
    signatureDate: [this.currDate, [Validators.required]],
  });

  @ViewChild('showUploadPDFPopupButton')
  public showUploadPDFPopupButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('closeUploadPDFButton')
  public closeUploadPDFButton!: ElementRef<HTMLButtonElement>;

  public constructor(
    private title: Title,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private langService: LangService,
    private userService: UsersService,
    private toastService: ToastrService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });

    if (!this.authService.userInfo) {
      this.router.navigate(['/intranet']);
      return;
    }

    this.route.queryParams.subscribe((query) => {
      const disableType = query['tipo'] as DisableAccountType;
      if (!disableType) {
        this.router.navigate(['/intranet']);
        return;
      }
      this.formGroup.get('disableType')?.setValue(disableType);
    });
    this.setMetadata();
  }

  public get lang() {
    return this.langService.language;
  }

  public isFieldInvalid(fieldName: string): any {
    return (
      this.formGroup.get(fieldName)?.errors &&
      this.formGroup.get(fieldName)?.touched
    );
  }

  public handleChangeDisableType($event: Event): void {
    const element = $event.target as HTMLInputElement;
    const value = element.value as DisableAccountType;
    const queryParams = { ...this.route.snapshot.queryParams };
    queryParams['tipo'] = value;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }

  public resetForm($event: MouseEvent) {
    $event.preventDefault();
    this.formGroup.reset();
    this.signature = null;
    const queryParams = { ...this.route.snapshot.queryParams };
    const disableType = queryParams['tipo'] as DisableAccountType;
    if (!disableType) {
      this.router.navigate(['/intranet']);
      return;
    }
    this.formGroup.get('disableType')?.setValue(queryParams['tipo']);
  }

  public onImageFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const fileList: FileList | null = inputElement.files;

    const allowedFormats = [
      'image/png',
      'image/jpeg',
      'image/svg+xml',
      'image/svg',
    ];

    if (!(fileList && fileList.length > 0)) {
      this.formGroup.get('signature')?.markAsTouched();
      return;
    }

    const file: File = fileList[0];
    if (!allowedFormats.includes(file.type)) {
      this.formGroup.get('signature')?.reset();
      this.formGroup.get('signature')?.markAsTouched();
      return;
    }
    this.displayPhoto(file);
    this.formGroup.get('signature')?.setValue(file);
    this.formGroup.get('signature')?.markAsTouched();
  }

  private displayPhoto(file: File) {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      this.signature = event.target?.result || null;
    };
    reader.readAsDataURL(file);
  }

  public handleDeleteSignature($event: MouseEvent) {
    $event.preventDefault();
    this.signature = null;
    this.formGroup.get('signature')?.reset();
    this.formGroup.get('signature')?.markAsTouched();
  }

  public onPdfFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const fileList: FileList | null = inputElement.files;
    const allowedFormats = ['application/pdf'];

    if (!fileList) return;

    const file: File = fileList[0];

    this.generatedPdfFile = file;
  }

  public handleCompleteRegister(event: MouseEvent) {
    event.preventDefault();
    if (!this.generatedPdfFile) return;

    const disableType = this.formGroup.get('disableType')?.value;
    const reason = this.formGroup.get('reason')?.value;

    const disableAccountInfo = {
      userId: this.authService.userInfo!.id,
      disableType,
      reason,
    };

    return this.userService
      .disableAccount(disableAccountInfo, this.generatedPdfFile)
      .subscribe({
        next: () => {
          this.toastService.success(
            labels.retirementSuccessfullyProcessed[this.lang],
          );
          this.closeUploadPDFButton.nativeElement.click();
          return this.router.navigate([`/intranet/perfil`]);
        },
        error: (error) => {
          this.toastService.error(labels.errorProcessingRetirement[this.lang]);
        },
      });
  }

  public handleSubmit() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      this.toastService.error(labels.formHasErrors[this.lang]);
      return;
    }
    this.printingPDF = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(window.print());
      }, 500);
    })
      .then(() => {
        setTimeout(() => {
          this.printingPDF = false;
        }, 1000);
      })
      .then(() => {
        this.showUploadPDFPopupButton.nativeElement.click();
      });
  }

  private setMetadata() {
    const charsetMeta = this.renderer.createElement('meta');
    this.renderer.setAttribute(charsetMeta, 'charset', 'utf-8');

    const generatorMeta = this.renderer.createElement('meta');
    this.renderer.setAttribute(generatorMeta, 'name', 'generator');
    this.renderer.setAttribute(generatorMeta, 'content', 'pdf2htmlEX');

    const compatibilityMeta = this.renderer.createElement('meta');
    this.renderer.setAttribute(
      compatibilityMeta,
      'http-equiv',
      'X-UA-Compatible',
    );
    this.renderer.setAttribute(
      compatibilityMeta,
      'content',
      'IE=edge,chrome=1',
    );

    const headElement = this.elementRef.nativeElement.ownerDocument.head;
    this.renderer.appendChild(headElement, charsetMeta);
    this.renderer.appendChild(headElement, generatorMeta);
    this.renderer.appendChild(headElement, compatibilityMeta);
  }

  public get currDate(): string {
    const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
    const parsedDate = new Date(
      Date.now() + timezoneOffsetInMinutes * 60 * 1000,
    );

    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    return parsedDate.toLocaleDateString('es-CO', options);
  }
}
