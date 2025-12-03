import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { InvalidTokenError, jwtDecode } from 'jwt-decode';
import {
  Observable,
  Subject,
  catchError,
  lastValueFrom,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';

import { environment } from '../../../environments/environment.development';
import { Commissions } from '../intranet/commissions/commissions.interfaces';
import { Role, UserInfo } from '../intranet/user/user.interfaces';
import { ResourcesService } from '../shared/resources/resource.service';
import {
  BasicUserInfo,
  ChangePasswordInfo,
  IdTokenPayload,
  LabeledRole,
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterCredentialsFromIntranet,
  RegisterResponse,
} from './auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authLoading: boolean = true;
  public userInfo: UserInfo | null = null;
  public activeRole: LabeledRole | null = null;
  public userAvatar: string | null = null;

  private sub = new Subject<LabeledRole>();
  public activeRole$ = this.sub.asObservable();

  private _baseUrl: string = `${environment.baseUrl}/auth`;

  private http: HttpClient = inject(HttpClient);
  private resourcesService: ResourcesService = inject(ResourcesService);
  private router: Router = inject(Router);
  private location: Location = inject(Location);

  public changePassword(changePasswordInfo: ChangePasswordInfo) {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${accessToken}`,
    );
    return this.http.put<{
      ok: boolean;
      message: string;
    }>(`${this._baseUrl}/change-password`, changePasswordInfo, { headers });
  }

  public async login(credentials: LoginCredentials) {
    this.authLoading = true;
    return lastValueFrom(
      this.http.post<LoginResponse>(`${this._baseUrl}/login`, {
        ...credentials,
      }),
    )
      .then((response) => this.processAuthResponse(response))
      .then(() =>
        lastValueFrom(
          this.resourcesService.getUserAvatarImageByUserId(this.userInfo!.id),
        ),
      )
      .then((response) => {
        this.processAvatarResponse(response);
      })
      .finally(() => {
        console.log({ MSG: 'Finally block' });
        this.authLoading = false;
      });
  }

  private processAvatarResponse(response: Blob) {
    if (response.size === 0) {
      this.userAvatar = '';
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const browserUrl = reader.result as string;
      this.userAvatar = browserUrl;
    };
    reader.readAsDataURL(response);
  }

  public updateUserRoles(id: string, newRoles: Role[]) {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}"`,
    );

    return this.http.put<{ ok: boolean; message: string }>(
      `${this._baseUrl}/users/roles`,
      { id, roles: newRoles },
      { headers },
    );
  }

  public generateNewPassword(userId: string) {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}`,
    );
    return this.http.put<{ ok: boolean; message: string }>(
      `${this._baseUrl}/generate-password`,
      { id: userId },
      { headers },
    );
  }

  public changeActiveRole(role: string) {
    const selectedRole =
      this.userInfo?.roles.find(({ role: userRole }) => userRole === role) ||
      false;
    if (!selectedRole) {
      return;
    }
    sessionStorage.setItem('active_role', role);
    this.activeRole = selectedRole;
    this.sub.next(selectedRole);
  }

  public logout() {
    sessionStorage.clear();
    this.userInfo = null;
    this.router.navigate(['/']);
    // Clean history to avoid going back to the intranet
    this.location.replaceState('/');
  }

  public refreshAuth(): Observable<void> {
    this.authLoading = true;
    const accessToken = sessionStorage.getItem('access_token');
    if (!accessToken) {
      this.authLoading = false;
      return of();
    }
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${accessToken}`,
    );
    this.authLoading = true;
    return this.http
      .get<LoginResponse>(`${this._baseUrl}/refresh`, {
        headers,
      })
      .pipe(
        switchMap((response) => {
          this.processAuthResponse(response);
          return this.resourcesService.getUserAvatarImageByUserId(
            this.userInfo!.id,
          );
        }),
      )
      .pipe(
        map((response) => {
          this.processAvatarResponse(response);
        }),
      )
      .pipe(
        tap(() => {
          this.authLoading = false;
        }),
      )
      .pipe(
        catchError((_, caught) => {
          this.authLoading = false;
          return caught;
        }),
      );
  }

  public validateAuth(): boolean {
    const token = sessionStorage.getItem('access_token') ?? '';
    try {
      jwtDecode(token);
      return true;
    } catch (error: any) {
      if (error instanceof InvalidTokenError) {
        this.userInfo = null;
      }
      return false;
    }
  }

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
    const { name, email, identification, phoneNumber, entryDate } =
      registerCredentials;
    formData.append('email', email);
    formData.append('identification', identification);
    formData.append('name', name);
    formData.append('phoneNumber', phoneNumber);
    formData.append('entryDate', new Date(entryDate).toISOString());
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

  public fetchBasicUserInfoById(userId: string) {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}`,
    );
    return this.http.get<BasicUserInfo>(`${this._baseUrl}/basic/${userId}`, {
      headers,
    });
  }

  public deleteUser(id: string) {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}`,
    );
    return this.http.delete<{ ok: boolean; message: string }>(
      `${this._baseUrl}/users/${id}`,
      { headers },
    );
  }

  public lockUserAccount(id: string, until?: Date) {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}`,
    );
    return this.http.put<{ ok: boolean; message: string }>(
      `${this._baseUrl}/users/lock`,
      { id, until },
      { headers },
    );
  }

  public unlockUserAccount(id: string) {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}`,
    );
    return this.http.put<{ ok: boolean; message: string }>(
      `${this._baseUrl}/users/unlock`,
      { id },
      { headers },
    );
  }

  public fetchRetirementStatus() {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}`,
    );

    return lastValueFrom(
      this.http.get<{ pendingToRetire: boolean }>(
        `${this._baseUrl}/users/retirement-status`,
        { headers },
      ),
    ).then((response) => response.pendingToRetire);
  }

  public confirmRetirement(userId: string): Promise<void> {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${accessToken}`,
    );
    return lastValueFrom(
      this.http.post<void>(
        `${this._baseUrl}/users/retirements/${userId}/confirm`,
        {},
        { headers },
      ),
    );
  }

  public denyRetirement(userId: string): Promise<void> {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${accessToken}`,
    );
    return lastValueFrom(
      this.http.post<void>(
        `${this._baseUrl}/users/retirements/${userId}/deny`,
        {},
        { headers },
      ),
    );
  }

  private processAuthResponse(response: LoginResponse): void {
    const { accessToken, idToken } = response;
    sessionStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('id_token', idToken);
    const tokenInfo = jwtDecode(idToken) as IdTokenPayload;

    this.userInfo = {
      id: tokenInfo.uuid,
      identification: tokenInfo.identification + '',
      email: tokenInfo.sub,
      name: tokenInfo.name,
      roles: (tokenInfo.roles as LabeledRole[]).sort((a, b) =>
        a.priority.localeCompare(b.priority),
      ),
      phoneNumber: tokenInfo.phoneNumber,
      commissions: tokenInfo.commissions as Commissions[],
      changedPass: tokenInfo.changed_pass,
      createdAt: tokenInfo.created_at,
      description: tokenInfo.description,
      orcid: tokenInfo.orcid,
      linkedin: tokenInfo.linkedin,
      scopus: tokenInfo.scopus,
      displayPolicies: tokenInfo.displayPolicies,
    };
    this.setActiveRole();
  }

  public setActiveRole() {
    const activeRole = sessionStorage.getItem('active_role');
    if (!activeRole) {
      // roles[0] is which has the highest priority
      sessionStorage.setItem('active_role', this.userInfo!.roles[0].role);
      this.activeRole = this.userInfo!.roles[0];
      return;
    }
    const isRolIncluded =
      this.userInfo?.roles.some(({ role }) => role === activeRole) || false;

    if (!isRolIncluded) {
      sessionStorage.removeItem('active_role');
      this.activeRole = this.userInfo!.roles[0];
      return;
    }

    this.activeRole = this.userInfo?.roles.find(
      ({ role }) => role === activeRole,
    )!;
  }

  public refreshUserAvatarImage() {
    return lastValueFrom(
      this.resourcesService.getUserAvatarImageByUserId(this.userInfo!.id),
    ).then((response) => {
      this.processAvatarResponse(response);
    });
  }
}
