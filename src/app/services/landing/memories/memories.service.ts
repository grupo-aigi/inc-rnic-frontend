import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, lastValueFrom, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment.development';
import {
  MemoriesFilterCriteria,
  MemoriesResponse,
  MemoryInfo,
  RecommendedMemory,
} from './memories.interfaces';

@Injectable({
  providedIn: 'root',
})
export class MemoriesService {
  private _baseUrl: string = `${environment.baseUrl}/memories`;

  public constructor(private readonly http: HttpClient) {}

  public fetchMemories(filters: MemoriesFilterCriteria) {
    const params = new HttpParams()
      .append('busqueda', filters.busqueda)
      .append('pagina', filters.pagina.toString())
      .append('cantidad', filters.cantidad.toString());

    return this.http.get<MemoriesResponse>(`${this._baseUrl}`, { params });
  }

  public deleteMemory(id: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.delete<void>(`${this._baseUrl}/${id}`, {
      headers,
    });
  }

  public createMemory(memory: MemoryInfo) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });

    return this.http.post(`${this._baseUrl}`, { ...memory }, { headers });
  }

  public updateMemory(memory: MemoryInfo) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });

    return this.http.put(
      `${this._baseUrl}/${memory.id!}`,
      { ...memory },
      { headers },
    );
  }

  public fetchAllSearchRecommendations(
    searchTerm: string,
    limit = 100,
  ): Observable<RecommendedMemory[]> {
    return this.http.get<RecommendedMemory[]>(
      `${this._baseUrl}/recommendations?search=${searchTerm}&limit=${limit}`,
    );
  }

  public searchMemories(searchTerm: string): any {
    throw new Error('Method not implemented.');
  }
}
