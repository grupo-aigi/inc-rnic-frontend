import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, lastValueFrom } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import filterFalsyValues from '../../../helpers/object-utils';
import { Pagination } from '../../shared/misc/pagination.interfaces';
import {
  CommissionMinuteInfo,
  CommissionMinuteSearchRecommendation,
  CommissionMinutesFilterCriteria,
  MinuteAttendance,
  MinuteConfirmation,
  MinutesResponse,
} from './minutes.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CommissionMinutesService {
  searchCommissionMinutes(searchTerm: string): any {
    throw new Error('Method not implemented.');
  }
  private _baseUrl: string = `${environment.baseUrl}/minutes/commissions`;

  public constructor(private readonly http: HttpClient) {}

  public async fetchMinutes(
    pagination: Pagination,
    minutesFilterCriteria?: CommissionMinutesFilterCriteria,
  ): Promise<MinutesResponse<CommissionMinuteInfo>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    let otherParams = {};
    if (minutesFilterCriteria) {
      otherParams = filterFalsyValues(minutesFilterCriteria);
    }

    const params = new HttpParams()
      .append('page', pagination.pagina.toString())
      .append('size', pagination.cantidad.toString())
      .appendAll(otherParams);

    return lastValueFrom(
      this.http.get<MinutesResponse<CommissionMinuteInfo>>(this._baseUrl, {
        params,
        headers,
      }),
    );
  }

  public fetchAssistantStatusByUserId(minuteId: string, id: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.get<{ assisted: boolean }>(
      `${this._baseUrl}/assistants/status/${minuteId}/user/${id}`,
      { headers },
    );
  }

  public isMinuteApproved(minuteId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.get<any>(`${this._baseUrl}/approvals/status/${minuteId}`, {
      headers,
    });
  }

  public hasUserAssisted(minuteId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.get<any>(
      `${this._baseUrl}/assistants/status/${minuteId}`,
      {
        headers,
      },
    );
  }

  public approveMinute(minuteId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.post<{ approved: boolean }>(
      `${this._baseUrl}/approvals/${minuteId}`,
      null,
      { headers },
    );
  }

  public removeApproval(minuteId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.delete<{ approved: boolean }>(
      `${this._baseUrl}/approvals/${minuteId}`,
      { headers },
    );
  }

  public removeMinute(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return lastValueFrom(
      this.http.delete<{ id: number }>(`${this._baseUrl}/${id}`, { headers }),
    );
  }

  public createMinute(minute: CommissionMinuteInfo): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<void>(`${this._baseUrl}`, minute, { headers });
  }

  public fetchApprovalCount(minuteId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<{ count: number }>(
      `${this._baseUrl}/approvals/count/${minuteId}`,
      { headers },
    );
  }

  public fetchAssistantsCount(minuteId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<{ count: number }>(
      `${this._baseUrl}/assistants/count/${minuteId}`,
      { headers },
    );
  }

  public fetchApprovers(minuteId: string, page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    });

    const params = new HttpParams()
      .append('page', page.toString())
      .append('size', size.toString());

    return this.http.get<MinuteConfirmation>(
      `${this._baseUrl}/approvals/${minuteId}`,
      { headers, params },
    );
  }

  public fetchAssistants(minuteId: string, page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    });
    const params = new HttpParams()
      .append('page', page.toString())
      .append('size', size.toString());

    return this.http.get<MinuteAttendance>(
      `${this._baseUrl}/assistants/${minuteId}`,
      { headers, params },
    );
  }

  public registerAssistant(
    minuteId: string,
    userId: string,
    attended: boolean,
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<{ ok: boolean; message: string }>(
      `${this._baseUrl}/assistants/minute/${minuteId}/user/${userId}?attended=${attended}`,
      undefined,
      { headers },
    );
  }

  public removeAssistant(minuteId: string, userId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    });

    return this.http.delete<{ removed: boolean }>(
      `${this._baseUrl}/assistants/minute/${minuteId}/user/${userId}`,
      { headers },
    );
  }

  public fetchAllCommissionMinutesSearchRecommendations(searchTerm: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    });
    return this.http.get<CommissionMinuteSearchRecommendation[]>(
      `${this._baseUrl}/recommendations?search=${searchTerm}`,
      { headers },
    );
  }

  public editMinute(id: string, minuteInfo: CommissionMinuteInfo) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    });

    return this.http.put<any>(
      `${this._baseUrl}/${id}`,
      { ...minuteInfo, commission: minuteInfo.commission.networkCommission },
      { headers },
    );
  }
}
