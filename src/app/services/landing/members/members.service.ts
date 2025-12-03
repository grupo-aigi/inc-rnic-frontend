import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import {
  GlobalMembersDistribution,
  MembersDistribution,
} from './members.interfaces';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private _baseUrl: string = `${environment.baseUrl}/members`;

  public constructor(private http: HttpClient) {}

  public fetchPartnersMap(): Observable<GlobalMembersDistribution> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.get<any>(`${this._baseUrl}/members-map`, { headers });
  }

  public updateMembersDistribution(
    id: number,
    membersDistribution: MembersDistribution,
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.put<MembersDistribution>(
      `${this._baseUrl}/members-distribution/${id}`,
      membersDistribution,
      { headers },
    );
  }

  public fetchMembersDistribution(type: 'NATIONAL' | 'INTERNATIONAL') {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.get<MembersDistribution[]>(
      `${this._baseUrl}/members-distribution/${type}`,
      { headers },
    );
  }

  public createMembersDistribution(membersDistribution: MembersDistribution) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.post<MembersDistribution>(
      `${this._baseUrl}/members-distribution`,
      membersDistribution,
      { headers },
    );
  }
}
