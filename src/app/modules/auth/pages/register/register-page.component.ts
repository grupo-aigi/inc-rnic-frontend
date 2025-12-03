import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import {
  formatDate,
  formatDateByLang,
} from '../../../../helpers/date-formatters';
import { RegisterCredentials } from '../../../../services/auth/auth.interfaces';
import { AuthService } from '../../../../services/auth/auth.service';
import { RegisterService } from '../../../../services/auth/register.service';
import { AppLanguage } from '../../../../services/shared/lang/lang.interfaces';
import { LangService } from '../../../../services/shared/lang/lang.service';
import labels from './register-page.lang';
import { Commissions } from '../../../../services/intranet/commissions/commissions.interfaces';

@Component({
  standalone: true,
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class RegisterPage implements OnInit {
  public formGroup: FormGroup = this.formBuilder.group({
    appendix1: this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      id: ['', [Validators.required, Validators.maxLength(50)]],
      issuedIn: ['', [Validators.required, Validators.maxLength(150)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(200)],
      ],
      phoneNumber: ['', [Validators.required]],
      linkedInstitutions: [
        '',
        [Validators.required, Validators.maxLength(500)],
      ],
      roles: [[], [this.hasAtLeastElements(1)]],
      otherRole: ['', [Validators.maxLength(200)]],
      interestLines: [[], [this.hasAtLeastElements(1)]],
      wishedCommissionsToWork: [[], [this.hasAtLeastElements(1)]],
      signature: [null, [Validators.required]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      currDate: [this.currDate, [Validators.required]],
    }),
    appendix2: this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      neighborCity: ['', [Validators.required, Validators.maxLength(150)]],
      id: ['', [Validators.required, Validators.maxLength(50)]],
      issuedIn: ['', [Validators.required, Validators.maxLength(150)]],
      hasPersonalEconomicInterests: ['NO', [Validators.required]],
      hasNonPersonalEconomicInterests: ['NO', [Validators.required]],
      hasPersonalNonEconomicInterests: ['NO', [Validators.required]],
      hasRelativesEconomicInterests: ['NO', [Validators.required]],

      personalEconomicInterests: ['', [Validators.maxLength(200)]],
      nonPersonalEconomicInterests: ['', [Validators.maxLength(200)]],
      personalNonEconomicInterests: ['', [Validators.maxLength(200)]],
      relativesEconomicInterests: ['', [Validators.maxLength(200)]],

      personalEconomicInterestsFinancialEntity: [
        '',
        [Validators.maxLength(200)],
      ],
      nonPersonalEconomicInterestsFinancialEntity: [
        '',
        [Validators.maxLength(200)],
      ],
      personalNonEconomicInterestsFinancialEntity: [
        '',
        [Validators.maxLength(200)],
      ],
      relativesEconomicInterestsFinancialEntity: [
        '',
        [Validators.maxLength(200)],
      ],

      personalEconomicInterestsDateAndDuration: [
        '',
        [Validators.maxLength(100)],
      ],
      nonPersonalEconomicInterestsDateAndDuration: [
        '',
        [Validators.maxLength(100)],
      ],
      personalNonEconomicInterestsDateAndDuration: [
        '',
        [Validators.maxLength(100)],
      ],
      relativesEconomicInterestsDateAndDuration: [
        '',
        [Validators.maxLength(100)],
      ],
      signature: [null, [Validators.required]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      currDate: [this.currDate, [Validators.required]],
    }),
    appendix3: this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      neighborCity: ['', [Validators.required, Validators.maxLength(150)]],
      id: ['', [Validators.required, Validators.maxLength(50)]],
      issuedIn: ['', [Validators.required, Validators.maxLength(150)]],
      signature: [null, [Validators.required]],
      signatureName: ['', [Validators.required, Validators.maxLength(200)]],
      currDate: [this.currDate, [Validators.required]],
      termsAndConditions: [false, [Validators.requiredTrue]],
    }),
  });

  public dateAndDurationFormGroup: FormGroup = this.formBuilder.group({
    date: ['', [Validators.required]],
    duration: ['', [Validators.required, Validators.min(1)]],
    unit: ['days', [Validators.required]],
  });

  public activeInterestToSetDate: string = '';
  public printingPDF: boolean = false;
  public deleteInputBorders = false;

  @ViewChild('showUploadPDFPopupButton')
  showUploadPDFPopupButton!: ElementRef<HTMLButtonElement>;

  @ViewChild('closeUploadPDFButton')
  closeUploadPDFButton!: ElementRef<HTMLButtonElement>;

  @ViewChild('closeDateAndDurationModalBtn')
  closeDateAndDurationModalBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('selectDurationSelect')
  selectDurationSelect!: ElementRef<HTMLSelectElement>;

  public appendix1Signature: string | ArrayBuffer | null = null;
  public appendix2Signature: string | ArrayBuffer | null = null;
  public appendix3Signature: string | ArrayBuffer | null = null;
  public generatedPdfFile: File | null = null;
  public modalTitle: { es: string; en: string } = { es: '', en: '' };

  constructor(
    private formBuilder: FormBuilder,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    public authService: AuthService,
    public registerService: RegisterService,
    private router: Router,
    private toastrService: ToastrService,
    private langService: LangService,

    private title: Title,
  ) {}

  public onImageFileSelected(appendix: string, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const fileList: FileList | null = inputElement.files;

    const allowedFormats = [
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/svg+xml',
      'image/svg',
    ];

    if (!(fileList && fileList.length > 0)) {
      this.formGroup.get(appendix)?.get('signature')?.markAsTouched();
      this.toastrService.error(labels.noFileSelected[this.lang]);
      return;
    }

    const file: File = fileList[0];
    if (!allowedFormats.includes(file.type)) {
      this.formGroup.get(appendix)?.get('signature')?.reset();
      this.formGroup.get(appendix)?.get('signature')?.markAsTouched();
      this.toastrService.error(labels.formatNotSupported[this.lang]);
      return;
    }
    this.displayPhoto(file, appendix);
    this.formGroup.get(appendix)?.get('signature')?.setValue(file);
    this.formGroup.get(appendix)?.get('signature')?.markAsTouched();
  }

  public onPdfFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const fileList: FileList | null = inputElement.files;
    const allowedFormats = ['application/pdf'];

    if (!fileList) return;

    const file: File = fileList[0];

    this.generatedPdfFile = file;
  }

  public formatDate(date: string) {
    if (!date) return '';
    return formatDate(date);
  }

  public getCurrentDate() {
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

  public handleCheckRole($event: Event): void {
    const element = $event.target as HTMLInputElement;

    const rolesControl = this.formGroup.get('appendix1')?.get('roles');
    const otherRoleControl = this.formGroup.get('appendix1')?.get('otherRole');
    if (!rolesControl) return;
    const currentRoles = rolesControl.value as string[];
    if (element.checked) {
      currentRoles.push(element.value);
      rolesControl.setValue(currentRoles);
      rolesControl.markAsTouched();
      if (element.value === 'Otro') {
        otherRoleControl?.addValidators([Validators.required]);
        otherRoleControl?.enable();
        otherRoleControl?.markAsTouched();
      }
    } else {
      rolesControl.setValue(
        currentRoles.filter((role) => role !== element.value),
      );
      if (element.value === 'Otro') {
        otherRoleControl?.removeValidators([Validators.required]);
        otherRoleControl?.setValue('');
        otherRoleControl?.markAsPristine();
        otherRoleControl?.disable();
      }
    }
  }

  public handleConfirmDateAndDuration(event: MouseEvent) {
    event.preventDefault();
    this.dateAndDurationFormGroup
      .get('unit')
      ?.setValue(this.selectDurationSelect.nativeElement.value);
    if (!this.dateAndDurationFormGroup.valid) {
      this.toastrService.error(labels.invalidDateOrDuration[this.lang]);
      this.dateAndDurationFormGroup.markAllAsTouched();
      return;
    }
    this.formGroup
      .get('appendix2')
      ?.get(this.activeInterestToSetDate)
      ?.setValue(this.dateAndDurationFormGroup.value);
    this.closeDateAndDurationModalBtn.nativeElement.click();
    this.activeInterestToSetDate = '';
    this.dateAndDurationFormGroup.reset();
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public handleOpenInterestDateModal(event: MouseEvent, interestType: string) {
    event.preventDefault();
    this.activeInterestToSetDate = interestType;

    if (interestType === 'personalEconomicInterestsDateAndDuration') {
      this.modalTitle = {
        es: 'Por favor establezca la fecha de inicio y duración de sus intereses económicos personales',
        en: 'Please set the start date and duration of your personal economic interests',
      };
    }
    if (interestType === 'nonPersonalEconomicInterestsDateAndDuration') {
      this.modalTitle = {
        es: 'Por favor establezca la fecha de inicio y duración de sus intereses económicos no personales',
        en: 'Please set the start date and duration of your non-personal economic interests',
      };
    }
    if (interestType === 'personalNonEconomicInterestsDateAndDuration') {
      this.modalTitle = {
        es: 'Por favor establezca la fecha de inicio y duración de sus intereses no económicos personales',
        en: 'Please set the start date and duration of your personal non-economic interests',
      };
    }
    if (interestType === 'relativesEconomicInterestsDateAndDuration') {
      this.modalTitle = {
        es: 'Por favor establezca la fecha de inicio y duración de los intereses económicos de sus familiares',
        en: 'Please set the start date and duration of your relatives economic interests',
      };
    }
  }

  @HostListener('window:beforeprint')
  onBeforePrint() {
    this.printingPDF = true;
  }

  @HostListener('window:afterprint')
  onAfterPrint() {
    this.printingPDF = false;
  }

  public handleCheckInterestLine($event: Event): void {
    const element = $event.target as HTMLInputElement;

    const interestLinesControl = this.formGroup
      .get('appendix1')
      ?.get('interestLines');
    if (!interestLinesControl) return;
    const currentInterestLines = interestLinesControl.value as string[];
    if (element.checked) {
      currentInterestLines.push(element.value);
      interestLinesControl.setValue(currentInterestLines);
      interestLinesControl.markAsTouched();
      return;
    }
    interestLinesControl.setValue(
      currentInterestLines.filter((line) => line !== element.value),
    );
  }

  public handleCheckWishedCommisionToWork($event: Event): void {
    const element = $event.target as HTMLInputElement;

    const wishedCommissionsToWorkControl = this.formGroup
      .get('appendix1')
      ?.get('wishedCommissionsToWork');
    if (!wishedCommissionsToWorkControl) return;
    const currentWishedCommissionsToWork =
      wishedCommissionsToWorkControl.value as string[];
    if (element.checked) {
      currentWishedCommissionsToWork.push(element.value);
      wishedCommissionsToWorkControl.setValue(currentWishedCommissionsToWork);
      wishedCommissionsToWorkControl.markAsTouched();
      return;
    }
    wishedCommissionsToWorkControl.setValue(
      currentWishedCommissionsToWork.filter(
        (commision) => commision !== element.value,
      ),
    );
  }

  public handleCheckTermsAndConditions($event: Event): void {
    const element = $event.target as HTMLInputElement;
    this.formGroup
      .get('appendix3')
      ?.get('termsAndConditions')
      ?.setValue(element.checked);
  }

  public isFieldInvalid(fieldset: string, fieldName: string): any {
    return (
      this.formGroup.get(fieldset)?.get(fieldName)?.errors &&
      this.formGroup.get(fieldset)?.get(fieldName)?.touched
    );
  }

  public getFieldValue(fieldset: string, fieldName: string): any {
    return (
      (this.formGroup.get(fieldset)?.get(fieldName)?.value as string) || ''
    );
  }

  private hasAtLeastElements(value: number): ValidatorFn {
    return (control: AbstractControl) => {
      const selectedValues = control.value || []; // Get selected values
      if (selectedValues.length < value) {
        return {
          [`selectAtLeast`]: {
            requiredMin: value,
            actualSelected: selectedValues.length,
          },
        };
      }
      return null;
    };
  }

  private displayPhoto(file: File, appendix: string) {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (appendix === 'appendix1') {
        this.appendix1Signature = event.target?.result || null;
      } else if (appendix === 'appendix2') {
        this.appendix2Signature = event.target?.result || null;
      } else if (appendix === 'appendix3') {
        this.appendix3Signature = event.target?.result || null;
      }
    };
    reader.readAsDataURL(file);
  }

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.langService.language]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });
    const allowedToRegister = this.registerService.acceptedAgreements;

    if (!allowedToRegister) {
      this.router.navigateByUrl('/auth/lineamientos-red');
      return;
    }
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

    this.formGroup.get('appendix1')?.get('otherRole')?.disable();

    const appendix2Control = this.formGroup.get('appendix2')!;
    appendix2Control.get('personalEconomicInterests')?.disable();
    appendix2Control.get('nonPersonalEconomicInterests')?.disable();
    appendix2Control.get('personalNonEconomicInterests')?.disable();
    appendix2Control.get('relativesEconomicInterests')?.disable();
    appendix2Control.get('personalEconomicInterestsFinancialEntity')?.disable();
    appendix2Control
      .get('nonPersonalEconomicInterestsFinancialEntity')
      ?.disable();
    appendix2Control
      .get('personalNonEconomicInterestsFinancialEntity')
      ?.disable();
    appendix2Control
      .get('relativesEconomicInterestsFinancialEntity')
      ?.disable();
    appendix2Control.get('personalEconomicInterestsDateAndDuration')?.disable();
    appendix2Control
      .get('nonPersonalEconomicInterestsDateAndDuration')
      ?.disable();
    appendix2Control
      .get('personalNonEconomicInterestsDateAndDuration')
      ?.disable();
    appendix2Control
      .get('relativesEconomicInterestsDateAndDuration')
      ?.disable();
  }

  public handleDeleteSignature(appendix: string, $event: MouseEvent) {
    $event.preventDefault();
    if (appendix === 'appendix1') {
      this.appendix1Signature = null;
    } else if (appendix === 'appendix2') {
      this.appendix2Signature = null;
    } else if (appendix === 'appendix3') {
      this.appendix3Signature = null;
    }
    this.formGroup.get(appendix)?.get('signature')?.reset();
  }

  public get currDate(): string {
    const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
    const parsedDate = new Date(
      Date.now() + timezoneOffsetInMinutes * 60 * 1000,
    );

    const navigatorLanguage = window.navigator.language || 'en-US';

    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    return parsedDate.toLocaleDateString(navigatorLanguage, options);
  }

  public handleYesNoToInterest(controlName: string, decision: 'YES' | 'NO') {
    this.formGroup.get('appendix2')?.get(controlName)?.setValue(decision);
    let interestBasename = controlName.split('has')[1];
    interestBasename =
      interestBasename.charAt(0).toLowerCase() + interestBasename.slice(1);
    if (decision === 'YES') {
      const interestControl = this.formGroup
        .get('appendix2')
        ?.get(`${interestBasename}`);
      interestControl?.addValidators([Validators.required]);
      interestControl?.enable();
      interestControl?.markAsTouched();

      const interestFinancialEntityControl = this.formGroup
        .get('appendix2')
        ?.get(`${interestBasename}FinancialEntity`);
      interestFinancialEntityControl?.addValidators([Validators.required]);
      interestFinancialEntityControl?.enable();
      interestFinancialEntityControl?.markAsTouched();

      const interestDateControl = this.formGroup
        .get('appendix2')
        ?.get(`${interestBasename}DateAndDuration`);
      interestDateControl?.addValidators([Validators.required]);
      interestDateControl?.enable();
      interestDateControl?.markAsTouched();
    } else {
      const interestControl = this.formGroup
        .get('appendix2')
        ?.get(`${interestBasename}`);
      interestControl?.removeValidators([Validators.required]);
      interestControl?.setValue('');
      interestControl?.markAsPristine();
      interestControl?.disable();

      const interestFinancialEntityControl = this.formGroup
        .get('appendix2')
        ?.get(`${interestBasename}FinancialEntity`);
      interestFinancialEntityControl?.removeValidators([Validators.required]);
      interestFinancialEntityControl?.setValue('');
      interestFinancialEntityControl?.markAsPristine();
      interestFinancialEntityControl?.disable();

      const interestDateControl = this.formGroup
        .get('appendix2')
        ?.get(`${interestBasename}DateAndDuration`);
      interestDateControl?.removeValidators([Validators.required]);
      interestDateControl?.setValue('');
      interestDateControl?.markAsPristine();
      interestDateControl?.disable();
    }
  }

  public hasInterestOfType(controlName: string): 'YES' | 'NO' {
    return this.formGroup.get('appendix2')?.get(controlName)?.value as
      | 'YES'
      | 'NO';
  }

  public validateNumber(event: KeyboardEvent): void {
    const inputChar = event.key;
    const pattern = /^[0-9]$/;

    if (!pattern.test(inputChar) || +inputChar < 0 || +inputChar > 10) {
      event.preventDefault();
    }
  }

  public resetForm($event: MouseEvent) {
    $event.preventDefault();
    this.formGroup.reset();
    this.appendix1Signature = null;
    this.appendix2Signature = null;
    this.appendix3Signature = null;
  }

  public handleCompleteRegister($event: MouseEvent) {
    $event.preventDefault();
    if (!this.generatedPdfFile) return;

    const name = this.formGroup.get('appendix1')?.get('name')?.value as string;
    const email = this.formGroup.get('appendix1')?.get('email')
      ?.value as string;
    const identification = this.formGroup.get('appendix1')?.get('id')
      ?.value as string;
    const phoneNumber = this.formGroup.get('appendix1')?.get('phoneNumber')
      ?.value as string;
    const commissions = this.formGroup
      .get('appendix1')
      ?.get('wishedCommissionsToWork')?.value as Commissions[];

    const registerInfo: RegisterCredentials = {
      name,
      email,
      identification,
      phoneNumber,
      commissions,
    };

    return this.authService
      .registerUser(registerInfo, this.generatedPdfFile)
      .subscribe({
        next: ({}) => {
          this.toastrService.success(
            labels.userRegisteredSuccessfully.description[this.lang],
            labels.userRegisteredSuccessfully.title[this.lang],
          );
          this.closeUploadPDFButton.nativeElement.click();
          return this.router.navigate(['/'] /*{ fragment: 'login' }*/);
        },
        error: ({ error, status }) => {
          this.toastrService.error(labels.errorRegisteringUser[this.lang]);
        },
      });
  }

  public handleSubmit() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      this.toastrService.error(labels.formHasErrors[this.lang]);
      return;
    }
    const additionalValidationsPassed = this.validateAdditionalFields();
    if (!additionalValidationsPassed) return;
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

  public validateAdditionalFields() {
    const id1 = this.formGroup.get('appendix1')?.get('id')?.value as string;
    const id2 = this.formGroup.get('appendix2')?.get('id')?.value as string;
    const id3 = this.formGroup.get('appendix3')?.get('id')?.value as string;
    if (id1 !== id2 || id1 !== id3) {
      this.toastrService.error(labels.invalidID[this.lang]);
      return false;
    }
    const name1 = this.formGroup.get('appendix1')?.get('name')?.value as string;
    const name2 = this.formGroup.get('appendix2')?.get('name')?.value as string;
    const name3 = this.formGroup.get('appendix3')?.get('name')?.value as string;
    if (name1 !== name2 || name1 !== name3) {
      this.toastrService.error(labels.invalidName[this.lang]);
      return false;
    }
    return true;
  }
}
