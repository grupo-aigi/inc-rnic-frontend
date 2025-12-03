
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { NetworkParticipantInfo } from '../../../../../../../../services/landing/partners/partners.interfaces';
import { PartnersService } from '../../../../../../../../services/landing/partners/partners.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { UploadOrReuseImageComponent } from '../../../../../shared/components/upload-or-reuse-image/upload-or-reuse-image.component';
import labels from './edit-coordinator.labels';

@Component({
  standalone: true,
  templateUrl: './edit-coordinator.component.html',
  imports: [ReactiveFormsModule, UploadOrReuseImageComponent],
})
export class EditCoordinatorPage implements OnInit {
  public editMode: { roleIndex: number } | undefined = undefined;
  public roles: string[] = [];
  public gender: 'M' | 'F' | 'O' = 'M';

  @ViewChild('editGenderSelect')
  public $genderSelect!: ElementRef<HTMLSelectElement>;

  public formGroup: FormGroup = this.formBuilder.group({
    fullName: ['', [Validators.required, Validators.maxLength(300)]],
    role: [''],
    displayContact: [''],
    gender: ['', [Validators.required]],
    linkedIn: ['', [Validators.pattern('^https?://.*')]],
    orcid: ['', [Validators.pattern('^https?://.*')]],
    scopus: ['', [Validators.pattern('^https?://.*')]],
    newImage: [''],
    imageName: [''],
  });

  public networkParticipantId: number = 0;
  public networkParticipantInfo: NetworkParticipantInfo | null = null;
  public imageBrowserUrl: string = '';
  public loading: boolean = true;

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private langService: LangService,
    private toastService: ToastrService,
    private partnersService: PartnersService,
    private resourcesService: ResourcesService,
  ) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) return;

      this.networkParticipantId = +id;
      this.partnersService
        .fetchNetworkParticipantById('COORDINATOR', +id)
        .subscribe({
          next: (value) => {
            this.networkParticipantInfo = value;
            this.initFormProps();
          },
          error: (err) => {
            this.toastService.error(labels.coordinatorNotFound[this.lang]);
            this.router.navigate([
              '/intranet/gestion-contenido/grupo-coordinador',
            ]);
          },
        });
    });
  }

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('groups', name);
  }

  public handleRemoveUploadedPhoto() {
    this.formGroup.get('newImage')?.setValue('');
  }

  private initFormProps() {
    const { name, roles, imageName, gender, displayContact, contact } =
      this.networkParticipantInfo!;
    this.roles = roles;

    // set the <select> value

    this.formGroup.get('fullName')?.patchValue(name);
    this.formGroup.get('displayContact')?.patchValue(displayContact);
    this.formGroup.get('gender')?.patchValue(gender);
    this.formGroup.get('linkedIn')?.patchValue(contact?.linkedin || '');
    this.formGroup.get('orcid')?.patchValue(contact?.orcid || '');
    this.formGroup.get('scopus')?.patchValue(contact?.scopus || '');
    this.formGroup.get('imageName')?.patchValue(imageName);
  }

  public handleAddRole() {
    const roleText = this.formGroup.get('role');
    if (!roleText?.value) {
      this.toastService.error(labels.roleRequired[this.lang]);
      return;
    }
    if (this.editMode) {
      this.roles[this.editMode.roleIndex] = roleText.value;
      this.editMode = undefined;
      roleText.setValue('');
      return;
    }
    this.roles.push(roleText.value);
    roleText.setValue('');
  }

  public handleEditRole(i: number) {
    this.editMode = { roleIndex: i };
    this.formGroup.get('role')?.setValue(this.roles[i]);
  }

  public handleDeleteRole(indexToRemove: number) {
    this.roles = this.roles.filter(
      (_element, index) => index !== indexToRemove,
    );
  }

  public handleSubmit() {
    this.formGroup
      .get('gender')
      ?.setValue(this.$genderSelect.nativeElement.value);
    if (this.formGroup.invalid) {
      this.toastService.error(labels.formHasErrors[this.lang]);
      this.formGroup.markAllAsTouched();
      return;
    }
    const updatedParticipantInfo: NetworkParticipantInfo = {
      name: this.formGroup.get('fullName')?.value,
      roles: this.roles,
      gender: this.formGroup.get('gender')?.value || 'O',
      displayContact: this.formGroup.get('displayContact')?.value as boolean,
      group: 'COORDINATOR',
      contact: {
        linkedin: this.formGroup.get('linkedIn')?.value || '',
        orcid: this.formGroup.get('orcid')?.value || '',
        scopus: this.formGroup.get('scopus')?.value || '',
      },
      imageName:
        this.formGroup.get('newImage')?.value ||
        this.networkParticipantInfo!.imageName,
    };

    const { id } = this.networkParticipantInfo!;
    this.partnersService
      .updateNetworkParticipant(id!, updatedParticipantInfo)
      .subscribe({
        next: () => {
          this.toastService.success(
            labels.coordinatorUpdatedSuccessfully[this.lang],
          );
          return this.router.navigate([
            '/intranet/gestion-contenido/grupo-coordinador',
          ]);
        },
        error: (err) => {
          this.toastService.error(labels.errorUpdatingCoordinator[this.lang]);
        },
      });
  }

  public get currentDate(): string {
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

  public handleSetCoordinatorImage(selectedImage: string) {
    this.formGroup.get('newImage')?.setValue(selectedImage);
  }

  public showContactVisibility() {
    this.formGroup.get('displayContact')?.setValue(true);
  }

  public hideContactVisibility() {
    this.formGroup.get('displayContact')?.setValue(false);
  }

  public isFieldInvalid(fieldName: string): any {
    return (
      this.formGroup.get(fieldName)?.errors &&
      this.formGroup.get(fieldName)?.touched
    );
  }

  public handleCleanFields(event: MouseEvent) {
    event.preventDefault();
    this.formGroup.reset();
    this.roles = [];
    this.formGroup.get('newImage')?.reset();
    this.formGroup.get('imageName')?.reset();
  }
}
