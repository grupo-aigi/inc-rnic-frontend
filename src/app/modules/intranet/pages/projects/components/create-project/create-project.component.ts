import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import {
  Mission,
  ProjectCreateInfo,
  ProjectCriteria,
  ProjectType,
} from '../../../../../../services/intranet/projects/projects.interfaces';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import labels from './create-project.lang';

@Component({
  standalone: true,
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class CreateProjectComponent implements OnInit {
  @Output() onCreate: EventEmitter<ProjectCreateInfo> = new EventEmitter();
  public specificObjectiveEditMode:
    | { specificObjectiveIndex: number }
    | undefined = undefined;

  public researcherAntecedentEditMode:
    | { researcherAntecedentIndex: number }
    | undefined = undefined;
  public collaborationRequirementEditMode:
    | { collaborationRequirementIndex: number }
    | undefined = undefined;

  public missions: Mission[] = labels.missionList;

  public researchLines: any[] = [];
  public researchLines2: any[] = [];

  public projectTypes: ProjectType[] = [];

  public criteriaList: ProjectCriteria[] = [];

  public formGroup: FormGroup = this.formBuilder.group({
    generalTitle: ['', [Validators.required, Validators.maxLength(1000)]],
    missionsIds: [[], [this.hasAtLeastElements(1)]],
    researchLineId: [, [Validators.required]],
    projectTypeId: [, [Validators.required]],
    generalDescription: this.formBuilder.group({
      researcherName: ['', [Validators.required, Validators.maxLength(1000)]],
      researcherInstitution: [
        '',
        [Validators.required, Validators.maxLength(1000)],
      ],
      researcherEmail: ['', [Validators.required, Validators.email]],
      researcherPhone: ['', [Validators.required, Validators.maxLength(1000)]],
    }),
    generalComponents: this.formBuilder.group({
      problem: ['', [Validators.required, Validators.maxLength(1000)]],
      justification: ['', [Validators.required, Validators.maxLength(1000)]],
      researchQuestion: ['', [Validators.required, Validators.maxLength(1000)]],
      generalObjective: ['', [Validators.required, Validators.maxLength(1000)]],
      specificObjective: ['', []],
      specificObjectives: [[], []],
      studyDesign: ['', [Validators.required, Validators.maxLength(1000)]],
      methodology: ['', [Validators.required, Validators.maxLength(1000)]],
      researchersAntecedent: ['', []],
      researchersAntecedents: [[], []],
      collaborationRequirement: ['', []],
      collaborationRequirements: [[], []],
    }),
    responseCriteria: this.formBuilder.group({
      orientedToDiscoveries: [null, [Validators.required]],
      appropriateness: [null, [Validators.required]],
      relevance: [null, [Validators.required]],
      probabilityOfSuccess: [null, [Validators.required]],
      replicableResults: [null, [Validators.required]],
      impact: [null, [Validators.required]],
    }),
  });

  public constructor(
    private formBuilder: FormBuilder,
    private langService: LangService,
    private toastService: ToastrService,
  ) {}

  public ngOnInit(): void {
    this.initResearchLine();
    this.langService.language$.subscribe((lang) => {
      this.initResearchLine();
    });

    this.researchLines = [
      {
        id: 1,
        name: {
          es: 'Biología del cáncer',
          en: 'Cancer biology',
        },
      },
      {
        id: 2,
        name: {
          es: 'Diagnóstico y tratamiento',
          en: 'Diagnosis and treatment',
        },
      },
      {
        id: 3,
        name: {
          es: 'Prevención primaria y detección precoz del cáncer',
          en: 'Primary prevention and early detection of cancer',
        },
      },
      {
        id: 4,
        name: {
          es: 'Actuar político y cáncer',
          en: 'Political action and cancer',
        },
      },
      {
        id: 5,
        name: {
          es: 'Diversidad y etiología del cáncer',
          en: 'Diversity and etiology of cancer',
        },
      },
      {
        id: 6,
        name: {
          es: 'Servicios y tecnologías para la atención integral del cáncer',
          en: 'Services and technologies for the comprehensive care of cancer',
        },
      },
      {
        id: 7,
        name: {
          es: 'Aspectos psicosociales del cáncer',
          en: 'Psychosocial aspects of cancer',
        },
      },
      {
        id: 8,
        name: {
          es: 'Epidemiología descriptiva y sistema de vigilancia del cáncer',
          en: 'Descriptive epidemiology and cancer surveillance system',
        },
      },
    ];

    this.projectTypes = [
      {
        id: 1,
        name: {
          es: 'Investigación',
          en: 'Research',
        },
      },
      {
        id: 2,
        name: {
          es: 'Innovación',
          en: 'Innovation',
        },
      },
      {
        id: 3,
        name: {
          es: 'Innovación/Investigación',
          en: 'Innovation/Research',
        },
      },
    ];

    this.criteriaList = [
      {
        id: 1,
        name: {
          es: 'Novedosos (orientados a nuevos descubrimientos).',
          en: 'Novel (oriented to new discoveries).',
        },
      },
      {
        id: 2,
        name: {
          es: 'Relevantes (orientados a la solución de problemas de salud pública).',
          en: 'Relevant (oriented to solving public health problems).',
        },
      },
      {
        id: 3,
        name: {
          es: 'Pertinencia (atiende a los problemas de salud, teniendo encuenta criterios de equidad)',
          en: 'Relevance (addresses health problems, taking into account equity criteria)',
        },
      },
      {
        id: 4,
        name: {
          es: 'Probabilidad de éxito (potencial, fortaleza y recursos del equipo de investigación.)',
          en: 'Probability of success (potential, strength and resources of the research team.)',
        },
      },
      {
        id: 5,
        name: {
          es: 'Resultados transferibles y/o replicables',
          en: 'Transferable and/or replicable results',
        },
      },
      {
        id: 6,
        name: {
          es: 'Impacto (beneficios y aplicación de los resultados)',
          en: 'Impact (benefits and application of the results)',
        },
      },
    ];
  }

  public initResearchLine() {
    this.researchLines2 = this.researchLines.map((researchLine) => {
      return {
        ...researchLine,
        name: researchLine.name[this.lang],
      };
    });
  }

  public get labels() {
    return labels;
  }

  public get specificObjectives() {
    return this.formGroup.get('generalComponents')?.get('specificObjectives')
      ?.value as string[];
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
      return null; // Successful validation
    };
  }

  public handleAddSpecificObjective() {
    const specificObjectiveControl = this.formGroup
      .get('generalComponents')
      ?.get('specificObjective');
    if (!specificObjectiveControl?.value) {
      this.toastService.error(
        'Debe ingresar texto en el campo de objetivo específico',
      );
      return;
    }
    const specificObjectivesControl = this.formGroup
      .get('generalComponents')
      ?.get('specificObjectives');
    if (this.specificObjectiveEditMode) {
      const specificObjectives = specificObjectivesControl?.value as string[];

      specificObjectives[
        this.specificObjectiveEditMode.specificObjectiveIndex
      ] = specificObjectiveControl.value as string;
      this.specificObjectiveEditMode = undefined;
      specificObjectiveControl.setValue('');
      return;
    }
    specificObjectivesControl?.setValue([
      ...specificObjectivesControl?.value,
      specificObjectiveControl?.value,
    ]);
    specificObjectiveControl.setValue('');
  }

  public handleEditSpecificObjective(i: number) {
    this.specificObjectiveEditMode = { specificObjectiveIndex: i };
    this.formGroup
      .get('generalComponents')
      ?.get('specificObjective')
      ?.setValue(this.specificObjectives[i]);
  }

  public handleDeleteSpecificObjective(indexToRemove: number) {
    const specificObjectivesControl = this.formGroup
      .get('generalComponents')
      ?.get('specificObjectives');
    specificObjectivesControl?.setValue(
      specificObjectivesControl?.value.filter(
        (_: string, index: number) => index !== indexToRemove,
      ),
    );
  }

  public get researchersAntecedents() {
    return this.formGroup
      .get('generalComponents')
      ?.get('researchersAntecedents')?.value as string[];
  }

  public handleAddResearcherAntecedent() {
    const researcherAntecedentControl = this.formGroup
      .get('generalComponents')
      ?.get('researchersAntecedent');
    if (!researcherAntecedentControl?.value) {
      this.toastService.warning(
        'Debe ingresar texto en el campo de antecedentes',
      );
      return;
    }
    const researchersAntecedentsControl = this.formGroup
      .get('generalComponents')
      ?.get('researchersAntecedents');
    if (this.researcherAntecedentEditMode) {
      const researchersAntecedents =
        researchersAntecedentsControl?.value as string[];

      researchersAntecedents[
        this.researcherAntecedentEditMode.researcherAntecedentIndex
      ] = researcherAntecedentControl.value as string;
      this.specificObjectiveEditMode = undefined;
      researcherAntecedentControl.setValue('');
      return;
    }
    researchersAntecedentsControl?.setValue([
      ...researchersAntecedentsControl?.value,
      researcherAntecedentControl?.value,
    ]);
    researcherAntecedentControl.setValue('');
  }

  public handleEditResearcherAntecedent(i: number) {
    this.researcherAntecedentEditMode = { researcherAntecedentIndex: i };
    this.formGroup
      .get('generalComponents')
      ?.get('researchersAntecedent')
      ?.setValue(this.researchersAntecedents[i]);
  }

  public handleDeleteResearcherAntecedent(indexToRemove: number) {
    const researchersAntecedentsControl = this.formGroup
      .get('generalComponents')
      ?.get('researchersAntecedents');
    researchersAntecedentsControl?.setValue(
      researchersAntecedentsControl?.value.filter(
        (_: string, index: number) => index !== indexToRemove,
      ),
    );
  }

  public get collaborationRequirements() {
    return this.formGroup
      .get('generalComponents')
      ?.get('collaborationRequirements')?.value as string[];
  }

  public handleAddCollaborationRequirement() {
    const collaborationRequirementControl = this.formGroup
      .get('generalComponents')
      ?.get('collaborationRequirement');
    if (!collaborationRequirementControl?.value) {
      this.toastService.warning(
        'Debe ingresar texto en el campo de requerimientos de colaboración',
      );
      return;
    }
    const collaborationRequirementsControl = this.formGroup
      .get('generalComponents')
      ?.get('collaborationRequirements');
    if (this.collaborationRequirementEditMode) {
      const collaborationRequirements =
        collaborationRequirementsControl?.value as string[];

      collaborationRequirements[
        this.collaborationRequirementEditMode.collaborationRequirementIndex
      ] = collaborationRequirementControl.value as string;
      this.specificObjectiveEditMode = undefined;
      collaborationRequirementControl.setValue('');
      return;
    }
    collaborationRequirementsControl?.setValue([
      ...collaborationRequirementsControl?.value,
      collaborationRequirementControl?.value,
    ]);
    collaborationRequirementControl.setValue('');
  }

  public handleEditCollaborationRequirement(i: number) {
    this.collaborationRequirementEditMode = {
      collaborationRequirementIndex: i,
    };
    this.formGroup
      .get('generalComponents')
      ?.get('collaborationRequirement')
      ?.setValue(this.collaborationRequirements[i]);
  }

  public handleDeleteCollaborationRequirement(indexToRemove: number) {
    const researchersAntecedentsControl = this.formGroup
      .get('generalComponents')
      ?.get('researchersAntecedents');
    researchersAntecedentsControl?.setValue(
      researchersAntecedentsControl?.value.filter(
        (_: string, index: number) => index !== indexToRemove,
      ),
    );
  }

  public isMissionSelected(id: number) {
    const currentMissionsIds = this.formGroup?.get('missionsIds')
      ?.value as number[];
    return currentMissionsIds.some((missionId) => missionId === id);
  }

  public handleToggleMission(currMissionId: number) {
    const missionsControl = this.formGroup?.get('missionsIds');
    const isSelected = this.isMissionSelected(currMissionId);

    if (isSelected) {
      missionsControl?.setValue(
        missionsControl?.value.filter(
          (missionId: any) => missionId !== currMissionId,
        ),
      );
    } else {
      missionsControl?.setValue([...missionsControl?.value, currMissionId]);
    }
  }

  public isCriteriaSelected(id: number) {
    let fieldName = '';
    switch (id) {
      case 1:
        fieldName = 'orientedToDiscoveries';
        break;
      case 2:
        fieldName = 'appropriateness';
        break;
      case 3:
        fieldName = 'relevance';
        break;
      case 4:
        fieldName = 'probabilityOfSuccess';
        break;
      case 5:
        fieldName = 'replicableResults';
        break;
      case 6:
        fieldName = 'impact';
        break;
      default:
        break;
    }
    const criteria = this.formGroup.get('responseCriteria')?.get(`${fieldName}`)
      ?.value as boolean | null;
    return criteria;
  }

  public isCriteriaInvalid(id: number) {
    let fieldName = '';
    switch (id) {
      case 1:
        fieldName = 'orientedToDiscoveries';
        break;
      case 2:
        fieldName = 'appropriateness';
        break;
      case 3:
        fieldName = 'relevance';
        break;
      case 4:
        fieldName = 'probabilityOfSuccess';
        break;
      case 5:
        fieldName = 'replicableResults';
        break;
      case 6:
        fieldName = 'impact';
        break;
      default:
        break;
    }
    const criteriaControl = this.formGroup
      .get('responseCriteria')
      ?.get(`${fieldName}`);
    return criteriaControl?.invalid && criteriaControl?.touched;
  }

  public handleToggleCriteria(id: number, value: boolean) {
    let fieldName = '';
    switch (id) {
      case 1:
        fieldName = 'orientedToDiscoveries';
        break;
      case 2:
        fieldName = 'appropriateness';
        break;
      case 3:
        fieldName = 'relevance';
        break;
      case 4:
        fieldName = 'probabilityOfSuccess';
        break;
      case 5:
        fieldName = 'replicableResults';
        break;
      case 6:
        fieldName = 'impact';
        break;
      default:
        break;
    }
    const criteriaControl = this.formGroup
      .get('responseCriteria')
      ?.get(`${fieldName}`);

    if (criteriaControl?.value === null) {
      criteriaControl?.setValue(value);
      criteriaControl.markAllAsTouched();
    } else {
      if (criteriaControl?.value === true && value === true) {
        criteriaControl?.setValue(null);
        return;
      } else if (criteriaControl?.value === false && value === false) {
        criteriaControl?.setValue(null);
        return;
      }
    }

    criteriaControl?.setValue(value);
  }

  public get lang() {
    return this.langService.language;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.formGroup.dirty) {
      $event.returnValue = true;
    }
  }

  public isFieldInvalid(fieldset: string, fieldName: string): any {
    return (
      this.formGroup.get(fieldset)?.get(fieldName)?.errors &&
      this.formGroup.get(fieldset)?.get(fieldName)?.touched
    );
  }

  public isFieldsetInvalid(fieldset: string): any {
    return (
      this.formGroup.get(fieldset)?.errors &&
      this.formGroup.get(fieldset)?.touched
    );
  }

  private getCurrentDate() {
    return new Date().toISOString().split('T')[0];
  }

  public handleSubmit() {
    if (this.formGroup.invalid) {
      this.toastService.error('El formulario contiene campos inválidos');
      this.formGroup.markAllAsTouched();
      return;
    }
    const projectInfo = this.formGroup.value as ProjectCreateInfo;

    this.onCreate.emit(projectInfo);

    // this.formGroup.reset();
  }
}
