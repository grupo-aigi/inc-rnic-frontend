import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import { UserProfileManagement } from '../net-management/net-management.interfaces';
import { UserProfileInfo } from './profile.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private _baseUrl: string = `${environment.baseUrl}/profiles`;

  public constructor(private readonly http: HttpClient) {}

  public updateUserInformation(updatedInfo: UserProfileInfo): Observable<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}`,
    );
    return this.http.put(`${this._baseUrl}`, { ...updatedInfo }, { headers });
  }

  public fetchProfileInfo(id: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.get<UserProfileManagement>(`${this._baseUrl}/${id}`, {
      headers,
    });
  }
}
