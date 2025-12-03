import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
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
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import departments from './departents';
import labels from './national-partners-management.lang';

@Component({
  standalone: true,
  selector: 'app-national-partners-management',
  templateUrl: './national-partners-management.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class NationalPartnersManagementComponent implements OnInit {
  @ViewChild('departmentSelect')
  public $departmentSelect!: ElementRef<HTMLSelectElement>;
  public departmentRecordIdToEdit: number = -1;
  public institutionIndexToEdit: number = -1;
  public displaySearchOptions: boolean = false;
  public recommendedOptions: string[] = [];

  public searchTerm: string = '';
  public searchDebounce: Subject<string> = new Subject();
  public nationalMembersDistributions: MembersDistribution[] = [];
  @Output() public onCreate: EventEmitter<NetworkParticipantInfo> =
    new EventEmitter();

  public formGroup: FormGroup = this.formBuilder.group({
    department: ['', [Validators.required, this.validDepartment]],
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
    private membersService: MembersService,
    private toastService: ToastrService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.searchDebounce.pipe(debounceTime(100)).subscribe((searchTerm) => {
      if (!searchTerm) return;
      this.recommendedOptions = departments.filter((department) =>
        department.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    });
    this.membersService
      .fetchMembersDistribution('NATIONAL')
      .subscribe((nationalMembersDistribution) => {
        this.nationalMembersDistributions = nationalMembersDistribution.sort(
          (a, b) => (a.content.name > b.content.name ? 1 : -1),
        );
        // .filter(
        //   (membersDistribution) =>
        //     membersDistribution.content.institutions.length > 0,
        // );
        this.loadingInfo = false;
      });
  }

  private validDepartment(control: AbstractControl): ValidationErrors | null {
    const validDepartment = departments.includes(control.value);
    if (!validDepartment) {
      return { invalidDepartment: true };
    }
    return null;
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public handleEditMembersDistribution() {
    const updatedInstitution = {
      name: this.editFormGroup.get('editInstitution')?.value,
      count: this.editFormGroup.get('editCount')?.value,
    };
  }

  public handleEditInstitution(id: number, institutionIndex: number) {
    this.editFormGroup.reset();
    this.departmentRecordIdToEdit = id;
    this.institutionIndexToEdit = institutionIndex;
    const institution = this.nationalMembersDistributions.find(
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
    const department = this.nationalMembersDistributions.find(
      (membersDistribution) => membersDistribution.id === id,
    );
    if (!department) {
      return this.toastService.error('No se encontró el departamento a editar');
    }
    const { content } = department;
    const { institutions } = content;
    const updatedInstitutions = institutions.filter(
      (_, index) => index !== institutionIndex,
    );

    return this.membersService
      .updateMembersDistribution(id, {
        ...department,
        content: {
          ...content,
          institutions: updatedInstitutions,
        },
      })
      .subscribe((membersDistribution) => {
        this.toastService.success('Institución eliminada con éxito');
        this.nationalMembersDistributions =
          this.nationalMembersDistributions.map(
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
    const department = this.nationalMembersDistributions.find(
      (membersDistribution) =>
        membersDistribution.id === this.departmentRecordIdToEdit,
    );
    if (!department) {
      return this.toastService.error('No se encontró el departamento a editar');
    }
    const { content } = department;
    const { institutions } = content;
    const updatedInstitutions = institutions.map((institution, index) => {
      if (index === this.institutionIndexToEdit) {
        return updatedInstitution;
      }
      return institution;
    });

    return this.membersService
      .updateMembersDistribution(this.departmentRecordIdToEdit, {
        ...department,
        content: {
          ...content,
          institutions: updatedInstitutions,
        },
      })
      .subscribe((membersDistribution) => {
        this.toastService.success('Institución editada con éxito');
        this.nationalMembersDistributions =
          this.nationalMembersDistributions.map(
            (nationalMembersDistribution) => {
              if (nationalMembersDistribution.id === membersDistribution.id) {
                return membersDistribution;
              }
              return nationalMembersDistribution;
            },
          );
        this.departmentRecordIdToEdit = -1;
      });
  }

  public handleCancelEditInstitution() {
    this.departmentRecordIdToEdit = -1;
    this.institutionIndexToEdit = -1;
    this.editFormGroup.reset();
  }

  public handleSelectDepartment(department: string, event: MouseEvent) {
    this.searchTerm = department;
    this.displaySearchOptions = false;
  }

  public handleAddMembersDistribution() {
    this.handleCancelEditInstitution();
    this.formGroup.get('department')?.setValue(this.searchTerm);
    if (this.formGroup.invalid) {
      this.toastService.error('El formulario tiene campos inválidos');
      this.formGroup.markAllAsTouched();
      return;
    }
    const department = this.nationalMembersDistributions.find(
      (membersDistribution) =>
        membersDistribution.content.name ===
        this.formGroup.get('department')?.value,
    );
    const institution = {
      name: this.formGroup.get('institution')?.value,
      count: this.formGroup.get('count')?.value,
    };
    if (department) {
      const { content } = department;
      const { institutions } = content;
      return this.membersService
        .updateMembersDistribution(department.id!, {
          ...department,
          content: {
            ...content,
            institutions: [...institutions, institution],
          },
        })
        .subscribe((membersDistribution) => {
          this.toastService.success('Institución agregada con éxito');
          this.nationalMembersDistributions =
            this.nationalMembersDistributions.map(
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
    const newDepartment: MembersDistribution = {
      type: 'NATIONAL',
      content: {
        institutions: [institution],
        name: this.formGroup.get('department')?.value,
      },
    };
    return this.membersService
      .createMembersDistribution(newDepartment)
      .subscribe((MembersDistribution) => {
        this.nationalMembersDistributions = [
          ...this.nationalMembersDistributions,
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
    return this.nationalMembersDistributions.filter(
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

  public get departments() {
    return departments;
  }

  public isFieldInvalid(fieldName: string): any {
    return (
      this.formGroup.get(fieldName)?.errors &&
      this.formGroup.get(fieldName)?.touched
    );
  }

  public getDepartmentMembersCount(institutions: Institution[]) {
    return institutions.reduce(
      (acc, institution) => acc + institution.count,
      0,
    );
  }
}
