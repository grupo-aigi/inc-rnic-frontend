import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, lastValueFrom } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import { NewsletterInfo } from './newsletter.interfaces';

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {
  private readonly _baseUrl = `${environment.baseUrl}/newsletters`;
  public constructor(private http: HttpClient) {}

  public fetchNewslettersSummaries(
    startYear: number,
    endYear: number,
  ): Observable<NewsletterInfo[]> {
    const params = new HttpParams()
      .append('startYear', startYear.toString())
      .append('endYear', endYear.toString());
    return this.http.get<NewsletterInfo[]>(`${this._baseUrl}`, { params });
  }

  public fetchNewsletterPdfFile(): Observable<NewsletterInfo[]> {
    return this.http.get<NewsletterInfo[]>(`${this._baseUrl}`);
  }

  public createNewsletter(newsletter: NewsletterInfo) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.post<void>(`${this._baseUrl}`, newsletter, { headers });
  }

  public deleteNewsletter(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return lastValueFrom(
      this.http.delete(`${this._baseUrl}/${id}`, { headers }),
    );
  }
}
