import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, lastValueFrom, of } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import {
  ScientificEcosystemCategory,
  ScientificEcosystemCreateInfo,
  ScientificEcosystemDetail,
  ScientificEcosystemPoster,
  ScientificEcosystemSearchRecommendation,
  ScientificEcosystemTag,
} from './scientific-ecosystem.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ScientificEcosystemService {
  private _baseUrl: string = `${environment.baseUrl}/scientific-ecosystem`;
  private _eventPosters: ScientificEcosystemPoster[] = [];

  constructor(private readonly http: HttpClient) {}

  public get eventPosters() {
    return this._eventPosters;
  }

  public async fetchScientificEcosystemPosters(): Promise<
    ScientificEcosystemPoster[]
  > {
    const list: ScientificEcosystemPoster[] = [
      {
        id: 1,
        title: 'Ecosistema Cáncer Colorrectal',
        urlName: 'ecosistema-cancer-colorrectal',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: 'Ecosistema Cáncer de Mama',
        urlName: 'ecosistema-cancer-mama',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        title: 'Ecosistema Cáncer de Pulmón',
        urlName: 'ecosistema-cancer-pulmon',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return list;

    // return lastValueFrom(
    //   this.http.get<ScientificEcosystemPoster[]>(
    //     this._baseUrl,
    //   ),
    // );
  }

  public removeScientificEcosystem(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return lastValueFrom(
      this.http.delete<{ id: number }>(`${this._baseUrl}/${id}`, { headers }),
    );
  }

  public createCategory(
    categoryName: string,
  ): Observable<ScientificEcosystemCategory> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.post<ScientificEcosystemCategory>(
      `${this._baseUrl}/category`,
      {
        name: categoryName,
      },
      { headers },
    );
  }

  public createTag(tagName: string): Observable<ScientificEcosystemTag> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.post<ScientificEcosystemTag>(
      `${this._baseUrl}/tag`,
      {
        name: tagName,
      },
      { headers },
    );
  }

  public fetchAllScientificEcosystemSearchRecommendations(
    searchTerm: string,
    limit: number = 100,
  ): Observable<ScientificEcosystemSearchRecommendation[]> {
    return this.http.get<ScientificEcosystemSearchRecommendation[]>(
      `${this._baseUrl}/recommendations?search=${searchTerm}`,
    );
  }

  public fetchTags(): Observable<ScientificEcosystemTag[]> {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders();
    headers.append('Authorization', `Bearer ${accessToken}`);
    return this.http.get<ScientificEcosystemTag[]>(`${this._baseUrl}/tags`, {
      headers,
    });
  }

  public createScientificEcosystem(
    eventInfo: ScientificEcosystemCreateInfo,
  ): Observable<{ urlName: string }> {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );

    const { baseInfo, detail } = eventInfo;

    return this.http.post<{ urlName: string }>(
      `${this._baseUrl}`,
      {
        baseInfo,
        detail,
      },
      { headers },
    );
  }

  public fetchScientificEcosystemTypes() {
    const eventTypes = [
      { id: 0, es: 'Nacional', en: 'National' },
      { id: 1, es: 'Internacional', en: 'International' },
    ];
    return of(eventTypes);
  }

  public editTag(tag: ScientificEcosystemTag) {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    return this.http.put<void>(
      `${this._baseUrl}/tag`,
      {
        ...tag,
      },
      { headers },
    );
  }

  public editCategory(tag: ScientificEcosystemTag) {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    return this.http.put<void>(
      `${this._baseUrl}/category`,
      {
        ...tag,
      },
      { headers },
    );
  }

  public fetchCategories(): Observable<ScientificEcosystemCategory[]> {
    return this.http.get<ScientificEcosystemCategory[]>(
      `${this._baseUrl}/categories`,
      {
        responseType: 'json',
        observe: 'body',
      },
    );
  }

  public updateScientificEcosystem(
    eventInfo: ScientificEcosystemCreateInfo,
  ): Observable<{ urlName: string }> {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    const { baseInfo, detail } = eventInfo;
    return this.http.put<{ urlName: string }>(
      `${this._baseUrl}/${eventInfo.baseInfo.id}`,
      {
        baseInfo,
        detail,
      },
      { headers },
    );
  }

  public fetchScientificEcosystemDetail(
    scientificEcosystemUrlNameToEdit: string,
  ): Observable<ScientificEcosystemDetail> {
    return this.http.get<ScientificEcosystemDetail>(
      `${this._baseUrl}/${scientificEcosystemUrlNameToEdit}`,
    );
  }
}
