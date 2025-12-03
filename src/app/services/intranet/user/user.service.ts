import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { Pagination } from '../../shared/misc/pagination.interfaces';
import {
  DisableAccountInfo,
  InputUserInfo,
  Role,
  UserManagement,
  UsersFilterCriteria,
  UsersSearchRecommendation,
} from './user.interfaces';
import { Commissions } from '../commissions/commissions.interfaces';
import filterFalsyValues from '../../../helpers/object-utils';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _baseUrl: string = `${environment.baseUrl}/auth`;

  public constructor(private http: HttpClient) {}

  public disableAccount(disableAccountInfo: DisableAccountInfo, file: File) {
    // FORM DATA
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', disableAccountInfo.userId);
    formData.append('disableType', disableAccountInfo.disableType);
    formData.append('reason', disableAccountInfo.reason);
    const headers = {
      authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    };
    return this.http.post<void>(
      `${this._baseUrl}/users/place-retirement`,
      formData,
      {
        headers,
      },
    );
  }

  public addUser(inputUserInfo: InputUserInfo) {}

  public fetchUsersInfo(
    filterCriteria: UsersFilterCriteria,
    pagination: Pagination,
  ) {
    const { pagina: page, cantidad: size } = pagination;
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${accessToken}`,
    );

    const searchParams: { [key: string]: string | number } = {};
    if (filterCriteria) {
      Object.keys(filterCriteria).forEach((key) => {
        if (filterCriteria[key as keyof UsersFilterCriteria]) {
          searchParams[key] = filterCriteria[key as keyof UsersFilterCriteria];
        }
      });
    }
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .appendAll(searchParams);

    return this.http.get<{ records: UserManagement[]; total: number }>(
      `${this._baseUrl}/users-management`,
      {
        headers,
        params,
      },
    );
  }

  public fetchUsersByName(
    search: string,
    role?: Role,
    commission?: Commissions,
  ) {
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    const truthyParams = filterFalsyValues({ role, commission, search });
    const params = new HttpParams().appendAll(truthyParams as any);
    return this.http.get<{ id: string; name: string }[]>(
      `${this._baseUrl}/users`,
      { headers, params },
    );
  }

  public fetchSearchRecommendations(search: string) {
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    const params = new HttpParams().append('search', search);
    return this.http.get<UsersSearchRecommendation[]>(
      `${this._baseUrl}/users/recommendations`,
      { params, headers },
    );
  }
}
