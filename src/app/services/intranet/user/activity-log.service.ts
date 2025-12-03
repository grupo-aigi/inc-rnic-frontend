import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ActivityItem } from './activity-log.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ActivityLogService {
  private _baseUrl: string = `${environment.baseUrl}/activity-logs`;

  public constructor(private http: HttpClient) {}

  public fetchActivityLog(page: number, size: number) {
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    const params = new HttpParams().append('page', page).append('size', size);

    return this.http.get<ActivityItem[]>(`${this._baseUrl}`, {
      params,
      headers,
    });
  }

  public countActivityLog() {
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    return this.http.get<{ count: number }>(`${this._baseUrl}/count`, {
      headers,
    });
  }
}
