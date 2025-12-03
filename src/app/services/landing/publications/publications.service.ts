import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment.development';
import {
  PublicationInfo,
  PublicationsFilterCriteria,
  RecommendedPublication,
} from './publications.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PublicationService {
  searchPublications(searchTerm: string): any {
    throw new Error('Method not implemented.');
  }
  private _baseUrl: string = `${environment.baseUrl}/publications`;

  public constructor(private readonly http: HttpClient) {}

  public fetchPublications(filters: PublicationsFilterCriteria) {
    const params = new HttpParams()
      .append('search', filters.search)
      .append('page', filters.page.toString())
      .append('size', filters.size.toString());

    return this.http.get<{ total: number; records: PublicationInfo[] }>(
      `${this._baseUrl}`,
      { params },
    );
  }

  public getAttachmentUrl(filename: string, originalFilename: string): string {
    return `${this._baseUrl}/attachments/${filename}?originalFilename=${originalFilename}`;
  }

  public deletePublication(id: string): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.delete<void>(`${this._baseUrl}/${id}`, {
      headers,
    });
  }

  public fetchPublicationDetail(urlName: string): Observable<PublicationInfo> {
    return this.http.get<PublicationInfo>(`${this._baseUrl}/${urlName}`);
  }

  public fetchSummaryPdfDocument(filename: string) {
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

  public fetchFileAttachment(filename: string) {
    return this.http
      .get(`${this._baseUrl}/attachments/${filename}`, { responseType: 'blob' })
      .pipe(
        map((value) => {
          return URL.createObjectURL(value);
        }),
      );
  }

  public createPublication(publication: PublicationInfo) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });

    return this.http.post(`${this._baseUrl}`, { ...publication }, { headers });
  }

  public updatePublication(publication: PublicationInfo) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });

    return this.http.put(
      `${this._baseUrl}/${publication.id!}`,
      { ...publication },
      { headers },
    );
  }

  public fetchAllSearchRecommendations(
    searchTerm: string,
    limit = 100,
  ): Observable<RecommendedPublication[]> {
    return this.http.get<RecommendedPublication[]>(
      `${this._baseUrl}/recommendations?search=${searchTerm}&limit=${limit}`,
    );
  }
}
