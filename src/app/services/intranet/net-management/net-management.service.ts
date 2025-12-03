import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, lastValueFrom } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import { Pagination } from '../../shared/misc/pagination.interfaces';
import {
  NetworkRegistration,
  NetworkRetirement,
  RegistrationFilterCriteria,
  RegistrationSearchRecommendation,
} from './net-management.interfaces';

@Injectable({
  providedIn: 'root',
})
export class NetworkManagementService {
  private _baseUrl: string = `${environment.baseUrl}/auth`;

  public constructor(private readonly http: HttpClient) {}

  public fetchAllRegistrationsRecommendations(
    searchTerm: string,
  ): Observable<RegistrationSearchRecommendation[]> {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    return this.http.get<RegistrationSearchRecommendation[]>(
      `${this._baseUrl}/registrations/recommendations?search=${searchTerm}`,
      { headers },
    );
  }

  public fetchAllRetirementsRecommendations(
    searchTerm: string,
  ): Observable<RegistrationSearchRecommendation[]> {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    return this.http.get<RegistrationSearchRecommendation[]>(
      `${this._baseUrl}/retirements/recommendations?search=${searchTerm}`,
      { headers },
    );
  }

  public fetchRegistrations(
    pagination: Pagination,
    filterCriteria?: RegistrationFilterCriteria,
  ) {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    const otherParams: { [key: string]: string | number } = {};
    if (filterCriteria) {
      Object.keys(filterCriteria).forEach((key) => {
        if (
          filterCriteria[key as keyof RegistrationFilterCriteria] !==
            undefined &&
          filterCriteria[key as keyof RegistrationFilterCriteria] !== null
        ) {
          otherParams[key as keyof RegistrationFilterCriteria] =
            filterCriteria[key as keyof RegistrationFilterCriteria]!;
        }
      });
    }
    const params = new HttpParams()
      .append('page', pagination.pagina.toString())
      .append('size', pagination.cantidad.toString())
      .appendAll(otherParams);

    return lastValueFrom(
      this.http.get<{ count: number; records: NetworkRegistration[] }>(
        `${this._baseUrl}/registrations`,
        { params, headers },
      ),
    );
  }

  public fetchRetirements(
    pagination: Pagination,
    filterCriteria?: RegistrationFilterCriteria,
  ) {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    const otherParams: { [key: string]: string | number } = {};
    if (filterCriteria) {
      Object.keys(filterCriteria).forEach((key) => {
        if (
          filterCriteria[key as keyof RegistrationFilterCriteria] !==
            undefined &&
          filterCriteria[key as keyof RegistrationFilterCriteria] !== null
        ) {
          otherParams[key as keyof RegistrationFilterCriteria] =
            filterCriteria[key as keyof RegistrationFilterCriteria]!;
        }
      });
    }
    const params = new HttpParams()
      .append('page', pagination.pagina.toString())
      .append('size', pagination.cantidad.toString())
      .appendAll(otherParams);

    return lastValueFrom(
      this.http.get<{ count: number; records: NetworkRetirement[] }>(
        `${this._baseUrl}/retirements`,
        { params, headers },
      ),
    );
  }
}
