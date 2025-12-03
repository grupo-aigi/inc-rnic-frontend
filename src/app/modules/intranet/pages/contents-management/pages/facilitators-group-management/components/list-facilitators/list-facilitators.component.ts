import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';

import { NetworkParticipantInfo } from '../../../../../../../../services/landing/partners/partners.interfaces';
import { PartnersService } from '../../../../../../../../services/landing/partners/partners.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import { DeleteFacilitatorConfirmationComponent } from '../delete-facilitator-confirmation/delete-facilitator-confirmation.component';
import labels from './list-facilitators.lang';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';

@Component({
  standalone: true,
  selector: 'app-list-facilitators',
  templateUrl: './list-facilitators.component.html',
  imports: [CarouselModule, RouterLink, DeleteFacilitatorConfirmationComponent],
})
export class ListFacilitatorsComponent implements OnInit {
  public partnersImages: string[] = [];
  public loading: boolean = true;
  public activeFacilitator: NetworkParticipantInfo | null = null;

  public facilitators: NetworkParticipantInfo[] = [];
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
    private resourcesService: ResourcesService,
    private toastrService: ToastrService,
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
      .fetchNetworkParticipants('FACILITATOR')
      .subscribe((facilitators) => {
        this.facilitators = facilitators;
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

  public handleSetActiveFacilitator(facilitator: NetworkParticipantInfo) {
    this.activeFacilitator = facilitator;
  }

  public handleConfirmDelete(id: number) {
    this.partnersService
      .deleteNetworkParticipant(id)
      .then(() => {
        this.facilitators = this.facilitators.filter(
          (facilitator) => facilitator.id !== id,
        );
        this.toastrService.success(
          'Se ha eliminado el facilitador exitosamente',
        );
        this.activeFacilitator = null;
      })
      .catch((err) => {
        return this.toastrService.error(
          'No se ha podido eliminar el facilitador',
        );
      });
  }
}
