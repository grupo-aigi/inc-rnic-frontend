import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import {
  CommissionMonthlyMembers,
  Commissions,
} from './commissions.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CommissionsService {
  private _baseUrl: string = `${environment.baseUrl}/commissions`;

  constructor(private readonly http: HttpClient) {}

  public fetchAllMembersOfCommission(commission: Commissions) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.get<{ id: string; name: string }[]>(
      `${this._baseUrl}/members/${commission}`,
      { headers },
    );
  }

  public fetchCommissionMembersCount(
    commission: Commissions,
    year: number,
    month: string,
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    headers.append('Content-Type', 'application/json');

    return of({ count: 10 });
    return this.http.get<{ count: number }>(
      `${this._baseUrl}/count/name/${commission}?year=${year}&month=${month}`,
      {
        headers,
      },
    );
  }

  public fetchCommissionMembers(year: number, month: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.get<{
      count: number;
      list: { id: string; userId: string }[];
    }>(`${this._baseUrl}/commissions`, { headers });
  }

  public fetchAllYearsByCommission(commission: Commissions) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.get<number[]>(
      `${this._baseUrl}/members/${commission}/years`,
      { headers },
    );
  }

  public fetchMembersOfCommissionByYear(value: Commissions, year: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.get<CommissionMonthlyMembers[]>(
      `${this._baseUrl}/members/${value}/year/${year}`,
      { headers },
    );
  }
}
