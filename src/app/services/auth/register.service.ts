import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';
import { LangService } from '../shared/lang/lang.service';
import { ResourcesService } from '../shared/resources/resource.service';
import {
  RegisterCredentials,
  RegisterCredentialsFromIntranet,
  RegisterResponse,
} from './auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private _baseUrl: string = `${environment.baseUrl}/auth`;
  public acceptedAgreements = false;

  private http: HttpClient = inject(HttpClient);
  private resourcesService: ResourcesService = inject(ResourcesService);
  private langService: LangService = inject(LangService);
  private router: Router = inject(Router);
  private location: Location = inject(Location);

  public registerUser(
    registerCredentials: RegisterCredentials,
    linkingFile: File,
  ): Observable<RegisterResponse> {
    const formData = new FormData();
    const { name, email, identification, phoneNumber } = registerCredentials;
    formData.append('email', email);
    formData.append('identification', identification);
    formData.append('name', name);
    formData.append('phoneNumber', phoneNumber);
    formData.append(
      'commissions',
      JSON.stringify(registerCredentials.commissions),
    );
    formData.append('linkingFile', linkingFile, linkingFile.name);

    return this.http.post<RegisterResponse>(
      `${this._baseUrl}/register`,
      formData,
    );
  }

  public registerUserFromIntranet(
    registerCredentials: RegisterCredentialsFromIntranet,
    linkingFile: File,
  ) {
    const formData = new FormData();
    const { name, email, identification, phoneNumber } = registerCredentials;
    formData.append('email', email);
    formData.append('identification', identification);
    formData.append('name', name);
    formData.append('phoneNumber', phoneNumber);
    formData.append(
      'entryDate',
      registerCredentials.entryDate.toString() + 'T00:00:00.000Z',
    );
    formData.append(
      'commissions',
      JSON.stringify(registerCredentials.commissions),
    );
    formData.append('linkingFile', linkingFile, linkingFile.name);

    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}`,
    );

    return this.http.post<RegisterResponse>(
      `${this._baseUrl}/manual-register`,
      formData,
      { headers },
    );
  }
}
