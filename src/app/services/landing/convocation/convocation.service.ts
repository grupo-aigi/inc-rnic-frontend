import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, lastValueFrom, of } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import { Pagination } from '../../shared/misc/pagination.interfaces';
import {
  ConvocationArchive,
  ConvocationCategory,
  ConvocationCreateInfo,
  ConvocationFilterCriteria,
  ConvocationPoster,
  ConvocationSearchRecommendation,
} from '../convocation/convocation.interfaces';
import filterFalsyValues from '../../../helpers/object-utils';

@Injectable({
  providedIn: 'root',
})
export class ConvocationService {
  private _baseUrl: string = `${environment.baseUrl}/convocations`;
  private _convocationPosters: ConvocationPoster[] = [];

  public constructor(private readonly http: HttpClient) {}

  public get convocationPosters() {
    return this._convocationPosters;
  }

  public async fetchConvocationPosters(
    pagination: Pagination,
    convocationFilterCriteria?: ConvocationFilterCriteria,
  ) {
    let otherParams: { [key: string]: string | number | boolean } = {};
    if (convocationFilterCriteria) {
      otherParams = filterFalsyValues(convocationFilterCriteria);
    }

    const params = new HttpParams()
      .append('pagina', pagination.pagina.toString())
      .append('cantidad', pagination.cantidad.toString())
      .appendAll(otherParams);

    return lastValueFrom(
      this.http.get<{ count: number; records: ConvocationPoster[] }>(
        this._baseUrl,
        {
          params,
        },
      ),
    );
  }

  public removeConvocation(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return lastValueFrom(
      this.http.delete<{ id: number }>(`${this._baseUrl}/${id}`, { headers }),
    );
  }

  public async fetchMostRecentConvocationPosters(
    pagination: Pagination,
    convocationFilterCriteria?: ConvocationFilterCriteria,
  ) {
    const params = new HttpParams()
      .append('page', pagination.pagina.toString())
      .append('size', pagination.cantidad.toString());

    return lastValueFrom(
      this.http.get<{ records: ConvocationPoster[]; count: number }>(
        this._baseUrl,
        {
          params,
        },
      ),
    );
  }

  public fetchConvocationDetail(urlName: string) {
    return this.http.get<ConvocationPoster>(`${this._baseUrl}/${urlName}`);
  }

  public createCategory(categoryName: string): Observable<ConvocationCategory> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.post<ConvocationCategory>(
      `${this._baseUrl}/category`,
      {
        name: categoryName,
      },
      { headers },
    );
  }

  // public fetchConvocationPosterDetail(
  //   urlName: string,
  // ): Observable<ConvocationPoster> {
  //   return this.http.get<ConvocationPoster>(`${this._baseUrl}/${urlName}`);
  // }

  public fetchAllConvocationSearchRecommendations(
    searchTerm: string,
    limit: number = 100,
  ): Observable<ConvocationSearchRecommendation[]> {
    return this.http.get<ConvocationSearchRecommendation[]>(
      `${this._baseUrl}/recommendations?search=${searchTerm}`,
    );
  }

  public createConvocation(
    convocationInfo: ConvocationCreateInfo,
  ): Observable<{ urlName: string }> {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );

    const { baseInfo, resources } = convocationInfo;

    return this.http.post<{ urlName: string }>(
      `${this._baseUrl}`,
      {
        ...baseInfo,
        resources: resources.map(({ TYPE, ...rest }) => ({
          resourceType: TYPE,
          content: JSON.stringify(rest),
        })),
      },
      { headers },
    );
  }

  public updateConvocation(
    convocationInfo: ConvocationCreateInfo,
  ): Observable<{ urlName: string }> {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    const { baseInfo, resources } = convocationInfo;
    return this.http.put<{ urlName: string }>(
      `${this._baseUrl}/${convocationInfo.baseInfo.id}`,
      {
        ...baseInfo,
        resources: resources.map(({ TYPE, ...rest }) => ({
          resourceType: TYPE,
          content: JSON.stringify(rest),
        })),
      },
      { headers },
    );
  }

  public fetchConvocationTypes() {
    const convocationTypes = [
      { id: 0, es: 'Nacional', en: 'National' },
      { id: 1, es: 'Internacional', en: 'International' },
    ];
    return of(convocationTypes);
  }

  public editCategory(category: ConvocationCategory) {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    return this.http.put<void>(
      `${this._baseUrl}/category`,
      { ...category },
      { headers },
    );
  }

  public fetchCategories(): Observable<ConvocationCategory[]> {
    return this.http.get<ConvocationCategory[]>(`${this._baseUrl}/categories`, {
      responseType: 'json',
      observe: 'body',
    });
  }

  public createConvocationArchive(filename: string, name: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.post<ConvocationArchive>(
      `${this._baseUrl}/archive`,
      {
        filename,
        name,
      },
      { headers },
    );
  }
}
