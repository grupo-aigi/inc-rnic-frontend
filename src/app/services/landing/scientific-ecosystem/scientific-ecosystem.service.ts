import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, delay, lastValueFrom, of, tap } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import {
  ScientificEcosystemApi,
  ScientificEcosystemCategory,
  ScientificEcosystemCreateInfo,
  ScientificEcosystemData,
  ScientificEcosystemDetail,
  ScientificEcosystemPoster,
  ScientificEcosystemSearchRecommendation,
  ScientificEcosystemTag,
} from './scientific-ecosystem.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ScientificEcosystemService {
  private _baseUrl: string = `${environment.baseUrl}/ecosystems`;
  private _scientificEcosystemPosters: ScientificEcosystemPoster[] = [];

  public constructor(private readonly http: HttpClient) {}

  public get scientificEcosystemPosters() {
    return this._scientificEcosystemPosters;
  }

  public fetchScientificEcosystemDetailByUrlName(
    urlName: string,
  ): Observable<ScientificEcosystemApi> {
    return this.http.get<ScientificEcosystemApi>(`${this._baseUrl}/${urlName}`);
  }

  public async fetchScientificEcosystemPosters(): Promise<
    ScientificEcosystemPoster[]
  > {
    return lastValueFrom(
      this.http.get<ScientificEcosystemPoster[]>(this._baseUrl),
    );
  }

  public fetchAllScientificEcosystemPosters(): Observable<
    ScientificEcosystemPoster[]
  > {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http
      .get<ScientificEcosystemPoster[]>(`${this._baseUrl}/all`, {
        headers,
      })
      .pipe(
        tap({
          next: (response) => {
            this._scientificEcosystemPosters = response;
          },
        }),
      );
  }

  public removeScientificEcosystem(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http
      .delete<{ id: number }>(`${this._baseUrl}/${id}`, {
        headers,
      })
      .pipe(
        tap({
          next: () => {
            this._scientificEcosystemPosters =
              this._scientificEcosystemPosters.filter(
                (poster) => poster.id !== id,
              );
          },
        }),
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

  public fetchPdfDocument(filename: string) {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${accessToken}`,
    );

    return lastValueFrom(
      this.http.request('GET', `${this._baseUrl}/files/${filename}`, {
        headers,
        responseType: 'arraybuffer',
      }),
    );
  }

  public toggleActive(id: number): Observable<void> {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );

    return this.http
      .put<void>(`${this._baseUrl}/${id}/status`, {}, { headers })
      .pipe(
        tap({
          next: () => {
            this._scientificEcosystemPosters =
              this._scientificEcosystemPosters.map((poster) => {
                if (poster.id === id) {
                  return { ...poster, active: !poster.active };
                }
                return poster;
              });
          },
        }),
      );
  }
}
