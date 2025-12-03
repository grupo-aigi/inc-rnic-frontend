import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { lastValueFrom } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  ProjectCreateInfo,
  ProjectFilterCriteria,
  ProjectInfo,
} from './projects.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private _baseUrl: string = `${environment.baseUrl}/projects`;

  public constructor(private http: HttpClient) {}

  public async fetchProjects(
    pagination: { page: number; size: number },
    projectFilterCriteria?: ProjectFilterCriteria,
  ): Promise<ProjectInfo[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });

    const otherParams: { [key: string]: string | number } = {};
    if (projectFilterCriteria) {
      Object.keys(projectFilterCriteria).forEach((key) => {
        if (!!projectFilterCriteria[key as keyof ProjectFilterCriteria]) {
          otherParams[key as keyof ProjectFilterCriteria] =
            projectFilterCriteria[key as keyof ProjectFilterCriteria]!;
        }
      });
    }

    const params = new HttpParams()
      .append('pagina', pagination.page.toString())
      .append('cantidad', pagination.size.toString())
      .appendAll(otherParams);

    return lastValueFrom(
      this.http.get<ProjectInfo[]>(this._baseUrl, { params, headers }),
    );
  }

  public createProject(projectInfo: ProjectCreateInfo) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.post<void>(
      `${this._baseUrl}`,
      {
        ...projectInfo,
      },
      { headers },
    );
  }
}
