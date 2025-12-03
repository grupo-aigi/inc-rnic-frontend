
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { NCPService } from '../../../../../../services/landing/ncp/ncp.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { ResourcesService } from '../../../../../../services/shared/resources/resource.service';
import { CurrentNCPComponent } from './components/display-ncp/current-ncp.component';
import { NCPUpdateComponent } from './components/update-ncp/ncp-update.component';
import labels from './ncp-management-page.language';
import { NCPInfo } from '../../../../../../services/landing/ncp/ncp.interfaces';

@Component({
  standalone: true,
  templateUrl: './ncp-management-page.component.html',
  imports: [CurrentNCPComponent, NCPUpdateComponent],
})
export class NCPManagementPage implements OnInit {
  @ViewChild('currentNCP') public currentNCP!: ElementRef<HTMLLIElement>;
  public activeTabIndex: number = 0;
  public ncpInfo: NCPInfo | null = null;

  public constructor(
    private title: Title,
    private ncpService: NCPService,
    private toastService: ToastrService,
    private resourcesService: ResourcesService,
    private langService: LangService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });
    this.ncpService
      .getNationalContactPoint()
      .then((ncpInfo) => {
        this.ncpInfo = ncpInfo;
      })
      .catch((err) => {
        this.toastService.warning(
          'No se ha podido obtener la obtener la información del NCP, posiblemente no existe.',
          'Alerta',
        );
      });
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public get ncpImageUrl() {
    if (!this.ncpInfo) return '';
    return this.resourcesService.getImageUrlByName(
      'ncp',
      this.ncpInfo?.imageName,
    );
  }

  public changeActiveTab(index: number): void {
    this.activeTabIndex = index;
  }

  public publishNCP(ncpInfo: NCPInfo) {
    const { id } = ncpInfo;
    if (id) {
      return this.ncpService.updateNCP(ncpInfo).subscribe({
        next: () => {
          this.toastService.success('NCP actualizado exitosamente');
          this.ncpInfo = ncpInfo;
          this.currentNCP.nativeElement.click();
          this.activeTabIndex = 0;
        },
        error: (err) => {
          this.toastService.error('Error al actualizar el NCP');
        },
      });
    } else {
      return this.ncpService.createNCP(ncpInfo).subscribe({
        next: () => {
          this.toastService.success('NCP creado exitosamente');
          this.ncpInfo = ncpInfo;
          this.currentNCP.nativeElement.click();
          this.activeTabIndex = 0;
        },
        error: (err) => {
          this.toastService.error('Error al crear el NCP');
        },
      });
    }
  }
}
