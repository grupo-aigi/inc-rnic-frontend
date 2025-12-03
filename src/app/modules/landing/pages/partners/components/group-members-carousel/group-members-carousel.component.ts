import { TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { MembersService } from '../../../../../../services/landing/members/members.service';
import { NetworkParticipantInfo } from '../../../../../../services/landing/partners/partners.interfaces';
import { PartnersService } from '../../../../../../services/landing/partners/partners.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';
import labels from './group-members-carousel.lang';

@Component({
  standalone: true,
  selector: 'app-group-members-carousel',
  templateUrl: './group-members-carousel.component.html',
  imports: [TitleCasePipe, CarouselModule],
})
export class GroupMembersCarouselComponent implements OnInit {
  @Input() public group!: 'COORDINATOR' | 'FACILITATOR';

  public loadingMembers: boolean = true;
  public members: NetworkParticipantInfo[] = [];
  public teamSlidesOptions: OwlOptions = {
    loop: false,
    margin: 30,
    nav: true,
    dots: false,
    autoplay: true,
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
    private title: Title,
    private partnersService: PartnersService,
    private resourcesService: ResourcesService,
    private membersService: MembersService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.partnersService
      .fetchNetworkParticipants(this.group)
      .subscribe((members) => {
        this.members = members;
        this.loadingMembers = false;
      });
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
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
}
