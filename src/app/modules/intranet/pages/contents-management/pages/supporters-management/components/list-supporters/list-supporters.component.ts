import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';

import { SupporterService } from '../../../../../../../../services/landing/supporters/supporters.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './list-supporters.lang';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { SupporterInfo } from '../../../../../../../../services/landing/supporters/supporters.interfaces';

@Component({
  standalone: true,
  selector: 'app-list-supporters',
  templateUrl: './list-supporters.component.html',
  imports: [CommonModule, CarouselModule],
})
export class ListSupportersComponent {
  public supportersImages: string[] = [];
  public loadingSupporters: boolean = true;
  public supporters: SupporterInfo[] = [];
  public supportersSlidesOptions: OwlOptions = {
    loop: true,
    margin: 30,
    nav: false,
    dots: false,
    autoplay: true,
    smartSpeed: 1000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 2,
      },
      576: {
        items: 3,
      },
      768: {
        items: 4,
      },
      1200: {
        items: 5,
      },
    },
  };

  public constructor(
    private supporterService: SupporterService,
    private toastrService: ToastrService,
    private resourcesService: ResourcesService,
    private router: Router,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.supporterService.fetchSupporters().subscribe((supporters) => {
      this.supporters = supporters.sort((a, b) => {
        return a.position! - b.position!;
      });
      this.loadingSupporters = false;
    });
  }

  public getImageUrlByName(name: string) {
    return this.resourcesService.getImageUrlByName('supporters', name);
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public handleEditNetworkParticipant(id: number) {}

  public handleMoveUp(id: string) {
    const supporter = this.supporters.find((supporter) => supporter.id === id);
    if (!supporter) {
      return;
    }
    const supporterIndex = this.supporters.indexOf(supporter);
    if (supporterIndex === 0) {
      return;
    }
    const previousSupporter = this.supporters[supporterIndex - 1];
    return this.supporterService
      .switchPositions(supporter.id!, previousSupporter.id!)
      .subscribe(() => {
        this.supporters[supporterIndex] = previousSupporter;
        this.supporters[supporterIndex - 1] = supporter;
        this.toastrService.success(
          'Se ha cambiado la posición del colaborador exitosamente',
        );
      });
  }

  public handleMoveDown(id: string) {
    const supporter = this.supporters.find((supporter) => supporter.id === id);
    if (!supporter) {
      return;
    }
    const supporterIndex = this.supporters.indexOf(supporter);
    if (supporterIndex === this.supporters.length - 1) {
      return;
    }
    const nextSupporter = this.supporters[supporterIndex + 1];
    return this.supporterService
      .switchPositions(supporter.id!, nextSupporter.id!)
      .subscribe(() => {
        this.supporters[supporterIndex] = nextSupporter;
        this.supporters[supporterIndex + 1] = supporter;
        this.toastrService.success(
          'Se ha cambiado la posición del colaborador exitosamente',
        );
      });
  }

  public handleRemoveSupporter(id: string) {
    this.supporterService
      .deleteSupporter(id)
      .then(() => {
        this.supporters = this.supporters.filter(
          (supporter) => supporter.id !== id,
        );
        this.toastrService.success(
          'Se ha eliminado el colaborador exitosamente',
        );
      })
      .catch((err) => {
        return this.toastrService.error(
          'No se ha podido eliminar el colaborador',
        );
      });
  }
}
