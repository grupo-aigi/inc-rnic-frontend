import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, lastValueFrom } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import { ResourcesService } from '../../shared/resources/resource.service';
import { AnnouncementInfo } from './announcement.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  public constructor(
    private http: HttpClient,
    private resourcesService: ResourcesService,
  ) {}

  private _baseUrl: string = environment.baseUrl;

  public createAnnouncement(
    announcementInfo: AnnouncementInfo,
  ): Observable<void> {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    return this.http.post<void>(
      `${this._baseUrl}/announcements`,
      {
        ...announcementInfo,
      },
      { headers },
    );
  }

  public async getAnnouncements(pagination: { page: number; size: number }) {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}`,
    );
    return lastValueFrom(
      this.http.get<AnnouncementInfo[]>(
        `${this._baseUrl}/announcements?page=${pagination.page}&size=${pagination.size}`,
        {
          headers,
        },
      ),
    );
  }

  public deleteAnnouncement(id: string) {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    return this.http.delete<void>(`${this._baseUrl}/announcements/${id}`, {
      headers,
    });
  }
}
