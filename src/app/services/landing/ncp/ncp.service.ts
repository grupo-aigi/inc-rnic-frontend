import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { NCPInfo } from './ncp.interfaces';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class NCPService {
  private _baseUrl: string = `${environment.baseUrl}/ncp`;

  public constructor(private http: HttpClient) {}

  public createNCP(ncpInfo: NCPInfo) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.post<void>(`${this._baseUrl}`, ncpInfo, { headers });
  }

  public updateNCP(ncpInfo: NCPInfo): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.put<void>(
      `${this._baseUrl}/${ncpInfo.id}`,
      { ...ncpInfo },
      { headers },
    );
  }

  public getNationalContactPoint(): Promise<NCPInfo> {
    return lastValueFrom(this.http.get<NCPInfo>(`${this._baseUrl}`));
  }
}
