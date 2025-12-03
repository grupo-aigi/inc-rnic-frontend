
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';

import { NetworkParticipantInfo } from '../../../../../../../../services/landing/partners/partners.interfaces';
import { PartnersService } from '../../../../../../../../services/landing/partners/partners.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { DeleteCoordinatorConfirmationComponent } from '../delete-coordinator-confirmation/delete-coordinator-confirmation.component';
import labels from './list-coordinators.lang';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';

@Component({
  standalone: true,
  selector: 'app-list-coordinators',
  templateUrl: './list-coordinators.component.html',
  imports: [
    CarouselModule,
    RouterLink,
    DeleteCoordinatorConfirmationComponent
],
})
export class ListCoordinatorsComponent implements OnInit {
  public partnersImages: { id: number; browserUrl: string }[] = [];
  public loading: boolean = true;
  public activeCoordinator: NetworkParticipantInfo | null = null;

  public coordinators: NetworkParticipantInfo[] = [];
  public teamSlidesOptions: OwlOptions = {
    loop: false,
    margin: 30,
    nav: true,
    dots: false,
    autoplay: false,
    smartSpeed: 1000,
    autoplayHoverPause: true,
    dotsData: true,
    navText: [
      "<i class='bx bx-chevron-left'></i>",
      "<i class='bx bx-chevron-right'></i>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 2,
      },
      768: {
        items: 2,
      },
      1200: {
        items: 3,
      },
    },
  };

  public constructor(
    private partnersService: PartnersService,
    private toastrService: ToastrService,
    private resourcesService: ResourcesService,
    private router: Router,
    private langService: LangService,
  ) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public ngOnInit(): void {
    this.partnersService
      .fetchNetworkParticipants('COORDINATOR')
      .subscribe((coordinators) => {
        this.coordinators = coordinators;
        this.loading = false;
      });
  }

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('groups', name);
  }

  public getPhotoByGender(gender: 'M' | 'F' | 'O') {
    if (gender === 'M') {
      return '/img/groups/default-male-photo.png';
    } else if (gender === 'F') {
      return '/img/groups/default-female-photo.png';
    } else {
      return '/img/groups/default-other-gender-photo.png';
    }
  }

  public handleEditNetworkParticipant(id: number) {}

  public handleSetActiveCoordinator(coordinator: NetworkParticipantInfo) {
    this.activeCoordinator = coordinator;
  }

  public handleConfirmDelete(id: number) {
    this.partnersService
      .deleteNetworkParticipant(id)
      .then(() => {
        this.coordinators = this.coordinators.filter(
          (coordinator) => coordinator.id !== id,
        );
        this.toastrService.success(
          labels.coordinatorDeletedSuccessfully[this.lang],
        );
        this.activeCoordinator = null;
      })
      .catch((err) => {
        return this.toastrService.error(
          labels.errorDeletingCoordinator[this.lang],
        );
      });
  }
}
