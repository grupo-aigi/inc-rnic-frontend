import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import {
  Subject,
  catchError,
  debounceTime,
  forkJoin,
  lastValueFrom,
  map,
  of,
  switchMap,
} from 'rxjs';

import { GroupMinutesService } from '../../../../../../../../../../../../services/intranet/minutes/group-minute.service';
import { MinuteAssistant } from '../../../../../../../../../../../../services/intranet/minutes/minutes.interfaces';
import { UsersService } from '../../../../../../../../../../../../services/intranet/user/user.service';
import { LangService } from '../../../../../../../../../../../../services/shared/lang/lang.service';
import { AppPagination } from '../../../../../../../../../../../../services/shared/misc/pagination.interfaces';
import { ResourcesService } from '../../../../../../../../../../../../services/shared/resources/resource.service';
import { CompletePaginationComponent } from '../../../../../../../../../../../landing/components/pagination/complete-pagination/complete-pagination.component';
import labels from './edit-minute-assistants.lang';

@Component({
  standalone: true,
  selector: 'app-edit-group-minute-assistants',
  templateUrl: './edit-minute-assistants.component.html',
  imports: [ReactiveFormsModule, CompletePaginationComponent],
})
export class EditGroupMinuteAssistantsComponent implements OnInit {
  @Input() public minuteId!: string;
  @Output() public onAddAssistant: EventEmitter<void> =
    new EventEmitter<void>();
  @Output() public onRemoveAssistant: EventEmitter<void> =
    new EventEmitter<void>();
  public searchDebounce: Subject<string> = new Subject();
  public loadingAssistants: boolean = true;
  public assistants: MinuteAssistant[] = [];
  public formGroup = this.formBuilder.group({
    searchTerm: [''],
    activeUserId: ['', [Validators.required]],
    attended: [undefined as boolean | undefined, [Validators.required]],
  });
  public loadingRecommendations: boolean = false;
  public recommendedUsers: { id: string; name: string }[] = [];
  public displaySearchOptions: boolean = false;
  public loadingOperation: boolean = false;
  public pagination: AppPagination = {
    totalElements: 0,
    pageSize: 5,
    currentPage: 1,
  };

  public constructor(
    private resourcesService: ResourcesService,
    private groupMinuteService: GroupMinutesService,
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private toastService: ToastrService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.fetchAssistants();
    this.registerSearchDebounce();
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public handleSetActiveUserId(userId: string) {
    this.formGroup.get('activeUserId')?.setValue(userId);
  }

  public handleResetActiveUser() {
    this.formGroup.get('activeUserId')?.setValue('');
  }

  public handleAttendedChange(event: Event) {
    const { value } = event.target as HTMLInputElement;
    const isYes = value === 'yes';
    const isNo = value === 'no';
    if (isYes) {
      this.formGroup.get('attended')?.setValue(true);
    } else if (isNo) {
      this.formGroup.get('attended')?.setValue(false);
    } else {
      this.formGroup.get('attended')?.setValue(undefined);
    }
  }

  public handleAddAssistant() {
    if (!this.formGroup.valid) {
      this.toastService.error(
        'Por favor, seleccione si el asistente asistió o no.',
      );
      return;
    }
    this.loadingOperation = true;
    const { attended, activeUserId } = this.formGroup.value;
    return this.groupMinuteService
      .registerAssistant(this.minuteId, activeUserId!, !!attended)
      .subscribe({
        next: () => {
          this.loadingOperation = false;
          this.displaySearchOptions = false;
          this.toastService.success(
            'El asistente ha sido agregado exitosamente.',
          );
          this.formGroup.get('searchTerm')?.setValue('');
          this.pagination.totalElements++;

          return this.handleFetchUserInfo(activeUserId);
        },
        error: () => {
          this.loadingOperation = false;
          this.displaySearchOptions = false;
          this.toastService.error(
            'Ha ocurrido un error al agregar el asistente.',
          );
        },
      });
  }

  private handleFetchUserInfo(
    activeUserId: string | null | undefined,
  ): Promise<void> {
    return lastValueFrom(
      this.resourcesService.getUserAvatarImageByUserId(activeUserId!),
    )
      .then((blob) => ({ userId: activeUserId!, content: blob }))
      .then(({ userId, content }) => {
        if (content.size === 0) {
          this.assistants.push({
            id: '',
            attended: this.formGroup.get('attended')?.value as boolean,
            assistant: {
              id: userId,
              name:
                this.recommendedUsers.find(({ id }) => id === userId)?.name ||
                '',
            },
            browserUrl: '',
          });
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          const browserUrl = reader.result as string;
          this.assistants.push({
            id: '',
            attended: this.formGroup.get('attended')?.value as boolean,
            assistant: {
              id: userId,
              name:
                this.recommendedUsers.find(({ id }) => id === userId)?.name ||
                '',
            },
            browserUrl,
          });
        };
        reader.readAsDataURL(content);
      })
      .finally(() => {
        this.onAddAssistant.emit();
      });
  }

  public handleDeleteAssistant(id: string) {
    this.loadingOperation = true;
    return this.groupMinuteService
      .removeAssistant(this.minuteId, id)
      .subscribe({
        next: () => {
          this.loadingOperation = false;
          this.toastService.success(
            'El asistente ha sido eliminado exitosamente.',
          );
          this.pagination.totalElements--;

          this.assistants = this.assistants.filter(
            ({ assistant }) => assistant.id !== id,
          );

          this.onRemoveAssistant.emit();
        },
        error: () => {
          this.loadingOperation = false;
          this.toastService.error(
            'Ha ocurrido un error al eliminar el asistente.',
          );
        },
      });
  }

  private registerSearchDebounce() {
    this.searchDebounce
      .pipe(
        debounceTime(750),
        switchMap((searchTerm) => {
          if (!searchTerm) {
            this.displaySearchOptions = false;
            return of([]);
          }
          this.loadingRecommendations = true;
          return this.userService.fetchUsersByName(searchTerm);
        }),
        switchMap((users) => {
          if (users.length === 0) {
            return of([]);
          }
          const statusObservables = users.map((user) =>
            this.groupMinuteService
              .fetchAssistantStatusByUserId(this.minuteId, user.id)
              .pipe(
                map((status) => ({ ...user, assisted: status.assisted })),
                catchError(() => of({ ...user, assisted: false })),
              ),
          );
          return forkJoin(statusObservables);
        }),
      )
      .subscribe((recommendations) => {
        this.displaySearchOptions = true;
        this.loadingRecommendations = false;
        this.recommendedUsers = recommendations.filter(
          ({ assisted }) => !assisted,
        );
      });
  }

  public handleOpenOptions($event: MouseEvent) {
    $event.preventDefault();
    const value = ($event.target as HTMLInputElement).value as string;
    if (value === '') return;
    this.displaySearchOptions = true;
  }

  public async handleSearchByTerm(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.displaySearchOptions = false;
      return;
    }
    this.searchDebounce.next(this.formGroup.get('searchTerm')?.value as string);
  }

  private fetchAssistants() {
    this.loadingAssistants = true;
    return this.groupMinuteService
      .fetchAssistants(
        this.minuteId,
        this.pagination.currentPage - 1,
        this.pagination.pageSize,
      )
      .subscribe({
        next: (minuteAttendance) => {
          this.assistants = minuteAttendance.items;
          this.pagination.totalElements = minuteAttendance.count;
          return this.fetchAssistantsInfo();
        },
      })
      .add(() => {
        this.loadingAssistants = false;
      });
  }

  private fetchAssistantsInfo() {
    return Promise.all(
      this.assistants.map(({ assistant }) =>
        lastValueFrom(
          this.resourcesService.getUserAvatarImageByUserId(assistant.id),
        )
          .then((blob) => ({ userId: assistant.id, content: blob }))
          .then(({ userId, content }) => {
            this.processAvatarResponse(content, userId);
          }),
      ),
    );
  }

  public handleGoToPage(page: number) {
    this.pagination.currentPage = page;
    this.fetchAssistants();
  }

  private processAvatarResponse(response: Blob, userId: string) {
    if (response.size === 0) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const browserUrl = reader.result as string;
      const approver = this.assistants.find(
        (item) => item.assistant.id === userId,
      );
      if (approver) {
        approver.browserUrl = browserUrl;
      }
    };
    reader.readAsDataURL(response);
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: HTMLElement) {
    const { classList } = targetElement;
    const id = targetElement.id;

    if (
      id === 'user-search-options' ||
      id === 'user-search-input' ||
      id === 'attended-yes' ||
      id === 'attended-no'
    ) {
      return;
    }
    this.displaySearchOptions = false;
  }
}
