import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, lastValueFrom, map } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import { SupporterInfo } from './supporters.interfaces';

@Injectable({
  providedIn: 'root',
})
export class SupporterService {
  private readonly _baseUrl = `${environment.baseUrl}/supporters`;
  public constructor(private http: HttpClient) {}

  public fetchSupporters(): Observable<SupporterInfo[]> {
    return this.http.get<SupporterInfo[]>(`${this._baseUrl}`);
  }

  public fetchSupporterById(id: string) {
    return this.http.get<SupporterInfo>(`${this._baseUrl}/${id}`);
  }

  public createSupporter(supporter: SupporterInfo) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.post<void>(`${this._baseUrl}`, supporter, { headers });
  }

  public updateSupporter(id: string, updatedParticipantInfo: SupporterInfo) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.put<void>(
      `${this._baseUrl}/${id}`,
      updatedParticipantInfo,
      { headers },
    );
  }

  public deleteSupporter(id: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return lastValueFrom(
      this.http.delete(`${this._baseUrl}/${id}`, { headers }),
    );
  }

  public switchPositions(id1: string, id2: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.put(
      `${this._baseUrl}/switch-positions`,
      {
        id1,
        id2,
      },
      { headers },
    );
  }
}
