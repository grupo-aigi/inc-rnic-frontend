import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, lastValueFrom, of } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import filterFalsyValues from '../../../helpers/object-utils';
import { Pagination } from '../../shared/misc/pagination.interfaces';
import {
  EventCategory,
  EventCreateInfo,
  EventFilterCriteria,
  EventPoster,
  EventSearchRecommendation,
  EventTag,
} from './event.interfaces';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private _baseUrl: string = `${environment.baseUrl}/events`;
  private _eventPosters: EventPoster[] = [];

  constructor(private readonly http: HttpClient) {}

  public get eventPosters() {
    return this._eventPosters;
  }

  public async fetchEventPosters(
    pagination: Pagination,
    eventFilterCriteria?: EventFilterCriteria,
  ) {
    let otherParams: { [key: string]: string | number | boolean } = {};
    if (eventFilterCriteria) {
      otherParams = filterFalsyValues(eventFilterCriteria);
    }

    const params = new HttpParams()
      .append('pagina', pagination.pagina.toString())
      .append('cantidad', pagination.cantidad.toString())
      .appendAll(otherParams);

    return lastValueFrom(
      this.http.get<{ count: number; records: EventPoster[] }>(this._baseUrl, {
        params,
      }),
    );
  }

  public removeEvent(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return lastValueFrom(
      this.http.delete<{ id: number }>(`${this._baseUrl}/${id}`, { headers }),
    );
  }

  public async fetchMostRecentEventPosters(
    pagination: Pagination,
    eventFilterCriteria?: EventFilterCriteria,
  ) {
    const params = new HttpParams()
      .append('page', pagination.pagina.toString())
      .append('size', pagination.cantidad.toString());

    return lastValueFrom(
      this.http.get<{ records: EventPoster[]; count: number }>(this._baseUrl, {
        params,
      }),
    );
  }

  public createCategory(categoryName: string): Observable<EventCategory> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.post<EventCategory>(
      `${this._baseUrl}/category`,
      {
        name: categoryName,
      },
      { headers },
    );
  }

  public createTag(tagName: string): Observable<EventTag> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.post<EventTag>(
      `${this._baseUrl}/tag`,
      {
        name: tagName,
      },
      { headers },
    );
  }

  public fetchEventPosterDetail(urlName: string): Observable<EventPoster> {
    return this.http.get<EventPoster>(`${this._baseUrl}/${urlName}`);
  }

  public fetchAllEventSearchRecommendations(
    searchTerm: string,
    limit: number = 100,
  ): Observable<EventSearchRecommendation[]> {
    return this.http.get<EventSearchRecommendation[]>(
      `${this._baseUrl}/recommendations?search=${searchTerm}`,
    );
  }

  public fetchTags(): Observable<EventTag[]> {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders();
    headers.append('Authorization', `Bearer ${accessToken}`);
    return this.http.get<EventTag[]>(`${this._baseUrl}/tags`, {
      headers,
    });
  }

  public createEvent(
    eventInfo: EventCreateInfo,
  ): Observable<{ urlName: string }> {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );

    const { baseInfo, resources } = eventInfo;

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

  public fetchEventTypes() {
    const eventTypes = [
      { id: 0, es: 'Nacional', en: 'National' },
      { id: 1, es: 'Internacional', en: 'International' },
    ];
    return of(eventTypes);
  }

  public editTag(tag: EventTag) {
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

  public editCategory(tag: EventTag) {
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

  public fetchCategories(): Observable<EventCategory[]> {
    return this.http.get<EventCategory[]>(`${this._baseUrl}/categories`, {
      responseType: 'json',
      observe: 'body',
    });
  }

  public updateEvent(
    eventInfo: EventCreateInfo,
  ): Observable<{ urlName: string }> {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    const { baseInfo, resources } = eventInfo;
    return this.http.put<{ urlName: string }>(
      `${this._baseUrl}/${eventInfo.baseInfo.id}`,
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
}
