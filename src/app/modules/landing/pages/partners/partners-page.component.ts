import { CommonModule, TitleCasePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import tippy from 'tippy.js';

import { GlobalMembersDistribution } from '../../../../services/landing/members/members.interfaces';
import { MembersService } from '../../../../services/landing/members/members.service';
import { NetworkParticipantInfo } from '../../../../services/landing/partners/partners.interfaces';
import { PartnersService } from '../../../../services/landing/partners/partners.service';
import { LangService } from '../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../services/shared/resources/resource.service';
import { GroupMembersCarouselComponent } from './components/group-members-carousel/group-members-carousel.component';
import labels from './partners-page.lang';

@Component({
  standalone: true,
  selector: 'app-partners-page',
  templateUrl: './partners-page.component.html',
  imports: [
    TitleCasePipe,
    CommonModule,
    CarouselModule,
    GroupMembersCarouselComponent,
  ],
})
export class PartnersPage implements OnInit, AfterViewInit {
  public selectedDepartmentName = 'BOGOTÁ';
  public loadingCoordinators: boolean = true;
  public loadingFacilitators: boolean = true;
  public loadingMap: boolean = true;
  public selectedScope: 'NATIONAL' | 'INTERNATIONAL' = 'NATIONAL';
  public globalMembersDistribution: GlobalMembersDistribution = {
    national: [],
    international: [],
  };
  public partnersImages: string[] = [];
  public coordinators: NetworkParticipantInfo[] = [];
  public facilitators: NetworkParticipantInfo[] = [];
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
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });

    this.partnersService
      .fetchNetworkParticipants('COORDINATOR')
      .subscribe((coordinators) => {
        this.coordinators = coordinators;
        this.loadingCoordinators = false;
      });

    this.partnersService
      .fetchNetworkParticipants('FACILITATOR')
      .subscribe((facilitators) => {
        this.facilitators = facilitators;
        this.loadingFacilitators = false;
      });

    this.membersService
      .fetchPartnersMap()
      .subscribe((globalMembersDistribution) => {
        this.globalMembersDistribution = globalMembersDistribution;
        this.loadingMap = false;
        setTimeout(() => {
          this.setupTooltips();
        }, 1000);
      });
  }

  private setupTooltips() {
    let selectedArea: any = null;
    let areasPath = document.querySelectorAll<SVGElement>('path');

    areasPath.forEach((area) => {
      if (area.id === 'INTERNACIONAL') {
        const internationalCount = this.getInternationalMembersCount();
        return tippy(area, {
          content: `Internacional: ${internationalCount}`, // Tooltip content
          placement: 'top', // Tooltip position (top, bottom, left, right, etc.)
        });
      }
      return tippy(area, {
        content: this.getMembersCountByDepartment(area.id), // Tooltip content
        placement: 'top', // Tooltip position (top, bottom, left, right, etc.)
      });
    });

    areasPath.forEach((area) => {
      area.style.fill = this.getDefaultColorByMemberCount(area.id);
      area.addEventListener('mouseover', () => {
        area.style.fill = '#12BEC8'; // add red on hover
        area.style.cursor = 'pointer';
      });
      area.addEventListener('mouseout', () => {
        area.style.fill = this.getDefaultColorByMemberCount(area.id);
      });
      area.addEventListener('click', () => {
        this.selectedDepartmentName = area.id;
        if (area.id === 'INTERNACIONAL') {
          this.selectedScope = 'INTERNATIONAL';
        } else {
          this.selectedScope = 'NATIONAL';
        }
        if (selectedArea) {
          // check if there is a selectedArea
          document
            .querySelector<SVGElement>(`#${selectedArea}`)
            ?.setAttribute('class', 'st0'); // changed
        }
        if (selectedArea !== area.id) {
          selectedArea = area.id;
          area.setAttribute('class', 'selectedArea'); // changed
        }
      });
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

  public ngAfterViewInit() {}

  private getInternationalMembersCount() {
    return (
      this.globalMembersDistribution?.international.reduce(
        (prev, { count }) => prev + count,
        0,
      ) || 0
    );
  }

  public curDepartmentInstitutions() {
    return (
      this.globalMembersDistribution?.national
        .find(({ name }) => name === this.selectedDepartmentName)!
        .institutions.sort((a, b) => a.localeCompare(b)) || []
    );
  }

  public curDepartmentCount() {
    return (
      this.globalMembersDistribution?.national.find(
        ({ name }) => name === this.selectedDepartmentName,
      )?.count || 0
    );
  }

  public getInternationalCount() {
    return (
      this.globalMembersDistribution?.international
        .map(({ count }) => count)
        .reduce((prev, curr) => prev + curr, 0) || 0
    );
  }

  private getDefaultColorByMemberCount(id: string): string {
    if (id === 'INTERNACIONAL') {
      return this.getColorByCount(this.getInternationalMembersCount());
    }
    const count = parseInt(this.getMembersCountByDepartment(id));
    return this.getColorByCount(count);
  }

  private getColorByCount(count: number) {
    if (count === 0) {
      return 'lightgray';
    } else if (count > 0 && count < 10) {
      return '#ffbf00';
    } else if (count >= 10 && count < 50) {
      return '#dd9f05';
    } else if (count >= 50) {
      return '#b57e06';
    }
    return 'black';
  }

  private getMembersCountByDepartment(id: string): string {
    return (
      this.globalMembersDistribution.national
        .find(({ name }) => name === id)
        ?.count.toString() || '0'
    );
  }

  public getInternationalInstitutions() {
    return this.globalMembersDistribution.international
      .filter(({ count }) => count > 0)
      .sort((a, b) => b.count - a.count)
      .map((country) => {
        return {
          ...country,
          institutions: country.institutions.sort((a, b) => a.localeCompare(b)),
        };
      });
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
