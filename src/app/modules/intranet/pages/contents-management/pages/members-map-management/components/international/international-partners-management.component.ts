import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';

import {
  Institution,
  MembersDistribution,
} from '../../../../../../../../services/landing/members/members.interfaces';
import { MembersService } from '../../../../../../../../services/landing/members/members.service';
import { NetworkParticipantInfo } from '../../../../../../../../services/landing/partners/partners.interfaces';
import { PartnersService } from '../../../../../../../../services/landing/partners/partners.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import countries from './countries';
import labels from './international-partners-management.lang';

@Component({
  standalone: true,
  selector: 'app-international-partners-management',
  templateUrl: './international-partners-management.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class InternationalPartnersManagementComponent {
  @ViewChild('countrySelect')
  public $countrySelect!: ElementRef<HTMLSelectElement>;
  public countryRecordIdToEdit: number = -1;
  public institutionIndexToEdit: number = -1;
  public displaySearchOptions: boolean = false;
  public recommendedOptions: string[] = [];

  public searchTerm: string = '';
  public searchDebounce: Subject<string> = new Subject();
  public internationalMembersDistributions: MembersDistribution[] = [];
  @Output() public onCreate: EventEmitter<NetworkParticipantInfo> =
    new EventEmitter();

  public formGroup: FormGroup = this.formBuilder.group({
    country: ['', [Validators.required, this.validCountry]],
    institution: ['', [Validators.required]],
    count: ['', [Validators.required, Validators.min(1)]],
  });

  public editFormGroup: FormGroup = this.formBuilder.group({
    editInstitution: ['', [Validators.required]],
    editCount: ['', [Validators.required, Validators.min(1)]],
  });
  public loadingInfo: boolean = true;

  public constructor(
    private formBuilder: FormBuilder,
    private partnersService: PartnersService,
    private membersService: MembersService,
    private toastService: ToastrService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.searchDebounce.pipe(debounceTime(100)).subscribe((searchTerm) => {
      if (!searchTerm) return;
      this.recommendedOptions = countries.filter((country) =>
        country.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    });
    this.membersService
      .fetchMembersDistribution('INTERNATIONAL')
      .subscribe((internationalMembersDistribution) => {
        this.internationalMembersDistributions =
          internationalMembersDistribution.sort((a, b) =>
            a.content.name > b.content.name ? 1 : -1,
          );
        // .filter(
        //   (membersDistribution) =>
        //     membersDistribution.content.institutions.length > 0,
        // );
        this.loadingInfo = false;
      });
  }

  private validCountry(control: AbstractControl): ValidationErrors | null {
    const validCountry = countries.includes(control.value);
    if (!validCountry) {
      return { invalidCountry: true };
    }
    return null;
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleEditMembersDistribution() {
    const updatedInstitution = {
      name: this.editFormGroup.get('editInstitution')?.value,
      count: this.editFormGroup.get('editCount')?.value,
    };
  }

  public handleEditInstitution(id: number, institutionIndex: number) {
    this.editFormGroup.reset();
    this.countryRecordIdToEdit = id;
    this.institutionIndexToEdit = institutionIndex;
    const institution = this.internationalMembersDistributions.find(
      (membersDistribution) => membersDistribution.id === id,
    )?.content.institutions[institutionIndex];
    if (!institution) {
      this.toastService.error('No se encontró la institución a editar');
      return;
    }
    this.editFormGroup.get('editInstitution')?.setValue(institution.name);
    this.editFormGroup.get('editCount')?.setValue(institution.count);
  }

  public handleDeleteInstitution(id: number, institutionIndex: number) {
    const country = this.internationalMembersDistributions.find(
      (membersDistribution) => membersDistribution.id === id,
    );
    if (!country) {
      return this.toastService.error('No se encontró el departamento a editar');
    }
    const { content } = country;
    const { institutions } = content;
    const updatedInstitutions = institutions.filter(
      (_, index) => index !== institutionIndex,
    );

    return this.membersService
      .updateMembersDistribution(id, {
        ...country,
        content: {
          ...content,
          institutions: updatedInstitutions,
        },
      })
      .subscribe((membersDistribution) => {
        this.toastService.success('Institución eliminada con éxito');
        this.internationalMembersDistributions =
          this.internationalMembersDistributions.map(
            (nationalMembersDistribution) => {
              if (nationalMembersDistribution.id === membersDistribution.id) {
                return membersDistribution;
              }
              return nationalMembersDistribution;
            },
          );
        // .filter(
        //   (membersDistribution) =>
        //     membersDistribution.content.institutions.length > 0,
        // );
      });
  }

  public handleConfirmEditInstitution() {
    const updatedInstitution = {
      name: this.editFormGroup.get('editInstitution')?.value,
      count: this.editFormGroup.get('editCount')?.value,
    };
    const country = this.internationalMembersDistributions.find(
      (membersDistribution) =>
        membersDistribution.id === this.countryRecordIdToEdit,
    );
    if (!country) {
      return this.toastService.error('No se encontró el departamento a editar');
    }
    const { content } = country;
    const { institutions } = content;
    const updatedInstitutions = institutions.map((institution, index) => {
      if (index === this.institutionIndexToEdit) {
        return updatedInstitution;
      }
      return institution;
    });

    return this.membersService
      .updateMembersDistribution(this.countryRecordIdToEdit, {
        ...country,
        content: {
          ...content,
          institutions: updatedInstitutions,
        },
      })
      .subscribe((membersDistribution) => {
        this.toastService.success('Institución editada con éxito');
        this.internationalMembersDistributions =
          this.internationalMembersDistributions.map(
            (nationalMembersDistribution) => {
              if (nationalMembersDistribution.id === membersDistribution.id) {
                return membersDistribution;
              }
              return nationalMembersDistribution;
            },
          );
        this.countryRecordIdToEdit = -1;
      });
  }

  public handleCancelEditInstitution() {
    this.countryRecordIdToEdit = -1;
    this.institutionIndexToEdit = -1;
    this.editFormGroup.reset();
  }

  public handleSelectCountry(country: string, event: MouseEvent) {
    this.searchTerm = country;
    this.displaySearchOptions = false;
  }

  public handleAddMembersDistribution() {
    this.handleCancelEditInstitution();
    this.formGroup.get('country')?.setValue(this.searchTerm);

    if (this.formGroup.invalid) {
      this.toastService.error('El formulario tiene campos inválidos');
      this.formGroup.markAllAsTouched();
      return;
    }
    const country = this.internationalMembersDistributions.find(
      (membersDistribution) =>
        membersDistribution.content.name ===
        this.formGroup.get('country')?.value,
    );
    const institution = {
      name: this.formGroup.get('institution')?.value,
      count: this.formGroup.get('count')?.value,
    };
    if (country) {
      const { content } = country;
      const { institutions } = content;
      return this.membersService
        .updateMembersDistribution(country.id!, {
          ...country,
          content: {
            ...content,
            institutions: [...institutions, institution],
          },
        })
        .subscribe((membersDistribution) => {
          this.toastService.success('Institución agregada con éxito');
          this.internationalMembersDistributions =
            this.internationalMembersDistributions.map(
              (nationalMembersDistribution) => {
                if (nationalMembersDistribution.id === membersDistribution.id) {
                  return membersDistribution;
                }
                return nationalMembersDistribution;
              },
            );
          // .filter(
          //   (membersDistribution) =>
          //     membersDistribution.content.institutions.length > 0,
          // );
          this.formGroup.get('institution')?.reset();
          this.formGroup.get('count')?.reset();
        });
    }
    const newCountry: MembersDistribution = {
      type: 'INTERNATIONAL',
      content: {
        institutions: [institution],
        name: this.formGroup.get('country')?.value,
      },
    };
    return this.membersService
      .createMembersDistribution(newCountry)
      .subscribe((MembersDistribution) => {
        this.internationalMembersDistributions = [
          ...this.internationalMembersDistributions,
          MembersDistribution,
        ].sort((a, b) => (a.content.name > b.content.name ? 1 : -1));
        // .filter(
        //   (membersDistribution) =>
        //     membersDistribution.content.institutions.length > 0,
        // );

        this.formGroup.get('institution')?.reset();
        this.formGroup.get('count')?.reset();
      });
  }

  public get filteredMembersDistributions() {
    return this.internationalMembersDistributions.filter(
      (membersDistribution) =>
        membersDistribution.content.institutions.length > 0,
    );
  }

  public async handleSearchByTerm($event: KeyboardEvent) {
    if ($event.key === 'Escape') {
      this.displaySearchOptions = false;
      return;
    } else if ($event.key === 'Enter') {
      this.displaySearchOptions = false;
      return this.executeFilters(); // Display all the recommended elements
    }
    this.searchDebounce.next(this.searchTerm);
  }

  public executeFilters() {
    this.displaySearchOptions = false;
  }

  public handleOpenOptions($event: MouseEvent) {
    $event.preventDefault();
    this.displaySearchOptions = true;
  }

  public get countries() {
    return countries;
  }

  public isFieldInvalid(fieldName: string): any {
    return (
      this.formGroup.get(fieldName)?.errors &&
      this.formGroup.get(fieldName)?.touched
    );
  }

  public getCountryMembersCount(institutions: Institution[]) {
    return institutions.reduce(
      (acc, institution) => acc + institution.count,
      0,
    );
  }
}
