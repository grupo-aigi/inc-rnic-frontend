import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { formatDate } from '../../../../../../../../helpers/date-formatters';
import { ScientificEcosystemPoster } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import { ScientificEcosystemService } from '../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { DeleteScientificEcosystemConfirmationComponent } from './components/delete-scientific-ecosystem-confirmation/delete-scientific-ecosystem-confirmation.component';
import labels from './scientific-ecosystem-list.lang';

@Component({
  standalone: true,
  selector: 'app-scientific-ecosystem-list',
  templateUrl: './scientific-ecosystem-list.component.html',
  styleUrl: './scientific-ecosystem-list.component.css',
  imports: [
    RouterLink,
    CommonModule,
    DeleteScientificEcosystemConfirmationComponent,
  ],
})
export class ScientificEcosystemListComponent implements OnInit {
  @Input()
  public variant: 'INTRANET' | 'PUBLIC' = 'PUBLIC';

  @Output()
  public onEditScientificEcosystem: EventEmitter<ScientificEcosystemPoster> =
    new EventEmitter();
  public loadingScientificEcosystems: boolean = true;
  public scientificEcosystems: ScientificEcosystemPoster[] = [];
  public scientificEcosystemToDelete: ScientificEcosystemPoster | null = null;

  public constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private resourcesService: ResourcesService,
    private toastService: ToastrService,
    private langService: LangService,
    private scientificEcosystemsService: ScientificEcosystemService,
  ) {}

  public ngOnInit(): void {
    if (location.href.includes('/intranet')) {
      this.variant = 'INTRANET';
    }
    this.route.queryParams.subscribe((params) => {
      const { pagina } = params;
      if (!pagina) {
        this.fetchScientificEcosystems();
        return;
      }
      if (isNaN(+pagina)) {
        this.toastService.error(labels.invalidPage[this.lang]);
        this.router.navigate(['/'], {});
        return;
      }
      this.fetchScientificEcosystems();
    });
  }

  public handleSetScientificEcosystemToDelete(
    scientificEcosystemPoster: ScientificEcosystemPoster,
  ) {
    this.scientificEcosystemToDelete = scientificEcosystemPoster;
  }

  private processFetchedScientificEcosystems(
    scientificEcosystemPosters: ScientificEcosystemPoster[],
  ): any {
    this.loadingScientificEcosystems = false;
    this.scientificEcosystems = scientificEcosystemPosters.sort(
      (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    );
  }

  public handleConfirmDelete(id: number) {
    return this.scientificEcosystemsService
      .removeScientificEcosystem(id)
      .then(({ id }) => {
        if (id) {
          this.scientificEcosystems = this.scientificEcosystems.filter(
            (scientificEcosystemPoster) => scientificEcosystemPoster.id !== id,
          );
          this.scientificEcosystemToDelete = null;
          return this.toastService.success(
            labels.scientificEcosystemDeletedSuccessfully[this.lang],
          );
        }
        return this.toastService.error(
          labels.scientificEcosystemNotDeleted[this.lang],
        );
      });
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  private fetchScientificEcosystems() {
    this.loadingScientificEcosystems = true;
    this.scientificEcosystemsService
      .fetchAllScientificEcosystemPosters()
      .then((results) => this.processFetchedScientificEcosystems(results));
  }

  public getImageByScientificEcosystemId(name: string) {
    return this.resourcesService.getImageUrlByName(
      'scientific-ecosystems',
      name,
    );
  }

  public handleEditScientificEcosystem(
    scientificEcosystemPoster: ScientificEcosystemPoster,
  ) {
    this.onEditScientificEcosystem.emit(scientificEcosystemPoster);
  }

  public trimScientificEcosystemDescription(description: string) {
    if (description.length > 200) {
      return description.slice(0, 200) + '...';
    }
    return description;
  }

  public formatDate(date: Date): string {
    return formatDate(date, false);
  }

  public wordToHexColor(word: string) {
    // Calculate a simple hash code for the word
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = word.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert the hash code to a 24-bit hex color
    const color = (hash & 0x00ffffff).toString(16).toUpperCase();

    // Pad the color with zeros if it's less than 6 characters long
    return '#' + '0'.repeat(6 - color.length) + color;
  }

  public handleToggleActive(poster: ScientificEcosystemPoster) {
    window.alert(`poster --> ${poster}`);
  }
}
