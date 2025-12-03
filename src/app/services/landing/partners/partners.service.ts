import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, lastValueFrom, map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { NetworkParticipantInfo } from './partners.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PartnersService {
  private readonly _baseUrl = `${environment.baseUrl}/groups`;

  public constructor(private http: HttpClient) {}

  public createNetworkParticipant(
    networkParticipantInfo: NetworkParticipantInfo,
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.post(`${this._baseUrl}`, networkParticipantInfo, {
      headers,
    });
  }

  public fetchNetworkParticipants(
    group: 'COORDINATOR' | 'FACILITATOR',
  ): Observable<NetworkParticipantInfo[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.get<NetworkParticipantInfo[]>(
      `${this._baseUrl}/${group}`,
      { headers },
    );
  }

  public fetchNetworkParticipantById(
    group: 'COORDINATOR' | 'FACILITATOR',
    id: number,
  ) {
    return this.http.get<NetworkParticipantInfo>(
      `${this._baseUrl}/${group}/${id}`,
    );
  }

  public updateNetworkParticipant(
    id: number,
    updatedParticipantInfo: NetworkParticipantInfo,
  ) {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    return this.http.put<void>(
      `${this._baseUrl}/${id}`,
      updatedParticipantInfo,
      { headers },
    );
  }

  public deleteNetworkParticipant(id: number) {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    return lastValueFrom(
      this.http.delete(`${this._baseUrl}/${id}`, { headers }),
    );
  }
}
