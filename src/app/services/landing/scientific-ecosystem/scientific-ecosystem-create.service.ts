import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, lastValueFrom, Observable, Subject, tap } from 'rxjs';
import {
  ScientificEcosystemCreateInfo,
  ScientificEcosystemDetailResourceType,
  ScientificEcosystemDetailType,
  ScientificEcosystemPoster,
} from './scientific-ecosystem.interfaces';
import { environment } from '../../../../environments/environment';
import { ScientificEcosystemService } from './scientific-ecosystem.service';

@Injectable({
  providedIn: 'root',
})
export class ScientificEcosystemCreateService {
  private _baseUrl: string = `${environment.baseUrl}/ecosystems`;
  private _scientificEcosystemToEdit: ScientificEcosystemPoster | null = null;
  private _createInfo: ScientificEcosystemCreateInfo | undefined;
  private sub = new Subject<boolean>();
  public editing$ = this.sub.asObservable();
  constructor(
    private readonly http: HttpClient,
    private scientificEcosystemService: ScientificEcosystemService,
  ) {}

  public get createInfo() {
    return this._createInfo;
  }

  public get scientificEcosystemToEdit() {
    return this._scientificEcosystemToEdit;
  }

  public async setupAllSections(title: string): Promise<void> {
    this._createInfo = {
      baseInfo: {
        title,
      },
      detail: {
        sections: [
          {
            TYPE: 'NOSOTROS',
            description: [],
          },
          {
            TYPE: 'OBJ_GENERAL',
            generalObjective: '',
          },
          {
            TYPE: 'OBJ_ESPECIFICOS',
            specificObjectives: [],
          },
          {
            TYPE: 'HOJA_RUTA',
            paragraphs: [],
            images: [],
            resources: [],
          },
          {
            TYPE: 'COMO_PARTICIPAR',
            paragraphs: [],
            images: [],
            resources: [],
          },
          {
            TYPE: 'LINEAMIENTOS',
            paragraphs: [],
            images: [],
            resources: [],
          },
          {
            TYPE: 'INTEGRANTES',
            images: [],
            paragraphs: [],
            resources: [],
          },
          {
            TYPE: 'PROYECTOS',
            paragraphs: [],
            images: [],
            resources: [],
            projects: [],
          },
          {
            TYPE: 'EVENTOS',
            events: [],
          },
          {
            TYPE: 'NOTICIAS',
            news: [],
          },
          {
            TYPE: 'CONTACTO',
            contacts: [],
          },
        ],
      },
    };
  }

  public async setScientificEcosystemToEdit(info: ScientificEcosystemPoster) {
    this._scientificEcosystemToEdit = info;
    this.sub.next(true);
    const scientificEcosystemDetail = await lastValueFrom(
      this.scientificEcosystemService.fetchScientificEcosystemDetailByUrlName(
        info.urlName,
      ),
    );

    this._createInfo = {
      baseInfo: {
        id: scientificEcosystemDetail.id,
        title: scientificEcosystemDetail.title,
      },
      detail: {
        sections: scientificEcosystemDetail.resources.map(
          ({ content, resourceType }) => {
            return {
              TYPE: resourceType,
              ...JSON.parse(content),
            };
          },
        ),
      },
    };

    return;
  }

  public resetCreateInfo() {
    this._createInfo = undefined;
    this._scientificEcosystemToEdit = null;
    this.sub.next(false);
  }

  public handleUpdateSection(
    sectionName: ScientificEcosystemDetailResourceType,
    data: ScientificEcosystemDetailType,
  ) {
    if (!this._createInfo?.detail) return;
    this._createInfo.detail.sections = this._createInfo.detail.sections.map(
      ({ TYPE, ...rest }) => {
        if (TYPE === sectionName) {
          return { ...rest, ...data, TYPE };
        }
        return { ...rest, TYPE };
      },
    );
  }

  public publishEcosystem(): Observable<{ urlName: string }> {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    if (!this._createInfo) return EMPTY;
    const { baseInfo, detail } = this._createInfo;

    return this.http
      .post<{ urlName: string }>(
        `${this._baseUrl}`,
        {
          ...baseInfo,
          resources: detail.sections.map(({ TYPE, ...rest }) => ({
            resourceType: TYPE,
            content: JSON.stringify(rest),
          })),
        },
        { headers },
      )
      .pipe(
        tap({
          next: () => {
            this._createInfo = undefined;
          },
        }),
      );
  }
}
