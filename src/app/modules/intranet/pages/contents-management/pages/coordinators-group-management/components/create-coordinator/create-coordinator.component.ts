import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { NetworkParticipantInfo } from '../../../../../../../../services/landing/partners/partners.interfaces';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { UploadOrReuseImageComponent } from '../../../../../shared/components/upload-or-reuse-image/upload-or-reuse-image.component';
import labels from './create-coordinator.lang';

@Component({
  standalone: true,
  selector: 'app-create-coordinator',
  templateUrl: './create-coordinator.component.html',
  imports: [ReactiveFormsModule, UploadOrReuseImageComponent],
})
export class CreateCoordinatorComponent {
  public editMode: { roleIndex: number } | undefined = undefined;
  public roles: string[] = [];
  public gender: 'M' | 'F' | 'O' = 'M';
  @ViewChild('genderSelect')
  public $genderSelect!: ElementRef<HTMLSelectElement>;

  @Output() public onCreate: EventEmitter<NetworkParticipantInfo> =
    new EventEmitter();

  public formGroup: FormGroup = this.formBuilder.group({
    fullName: ['', [Validators.required, Validators.maxLength(300)]],
    role: [''],
    displayContact: [true],
    gender: ['', [Validators.required]],
    linkedIn: ['', [Validators.pattern('^https?://.*')]],
    orcid: ['', [Validators.pattern('^https?://.*')]],
    scopus: ['', [Validators.pattern('^https?://.*')]],
    imageName: [''],
  });

  public constructor(
    private formBuilder: FormBuilder,
    private langService: LangService,
    private resourcesService: ResourcesService,
    private toastService: ToastrService,
  ) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleAddRole() {
    const roleText = this.formGroup.get('role');
    if (!roleText?.value) {
      this.toastService.error('Debe ingresar texto en el campo de rol');
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
      this.toastService.error('El formulario contiene campos inválidos');
      this.formGroup.markAllAsTouched();
      return;
    }
    const participantInfo: NetworkParticipantInfo = {
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
      imageName: this.formGroup.get('imageName')?.value || '',
    };

    this.onCreate.emit(participantInfo);
    this.formGroup.reset();
    this.roles = [];
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
    this.formGroup.get('imageName')?.setValue(selectedImage);
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

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('groups', name);
  }

  public handleCleanFields(event: MouseEvent) {
    event.preventDefault();
    this.formGroup.reset();
    this.roles = [];
    this.formGroup.get('imageName')?.reset();
  }
}
