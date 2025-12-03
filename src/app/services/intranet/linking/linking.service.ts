import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RegisterResponse } from '../../auth/auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class LinkingService {
  private _baseUrl: string = `${environment.baseUrl}/linking`;

  public constructor(private http: HttpClient) {}

  public fetchLinkingPDF() {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${accessToken}`,
    );

    return lastValueFrom(
      this.http.request('GET', `${this._baseUrl}/linking-file`, {
        headers,
        responseType: 'arraybuffer',
      }),
    );
  }

  public signPdfDocument(pdfFile: File): Promise<ArrayBuffer> {
    const formData = new FormData();
    formData.append('pdf', pdfFile);

    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${accessToken}`,
    );

    return lastValueFrom(
      this.http.request('POST', `${this._baseUrl}/sign`, {
        headers,
        body: formData,
        responseType: 'arraybuffer',
      }),
    );
  }

  public fetchApprovalLetterPDF() {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${accessToken}`,
    );

    return lastValueFrom(
      this.http.request('GET', `${this._baseUrl}/approval-letter`, {
        headers,
        responseType: 'arraybuffer',
      }),
    );
  }

  public fetchNetworkCardPDF() {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${accessToken}`,
    );

    return lastValueFrom(
      this.http.request('GET', `${this._baseUrl}/network-card`, {
        headers,
        responseType: 'arraybuffer',
      }),
    );
  }

  public fetchLinkingCertificatePDF() {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${accessToken}`,
    );

    return lastValueFrom(
      this.http.request('GET', `${this._baseUrl}/linking-certificate`, {
        headers,
        responseType: 'arraybuffer',
      }),
    );
  }

  /*
   * This method is allowed for ADMIN only
   */
  public fetchUserRegistrationPdf(userId: string) {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${accessToken}`,
    );

    return this.http.get(
      `${this._baseUrl}/users/${userId}/documents/registration-file`,
      {
        headers,
        responseType: 'arraybuffer',
      },
    );
  }

  /*
   * This method is allowed for ADMIN only
   */
  public fetchUserRetirementPdf(userId: string) {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${accessToken}`,
    );

    return this.http.get(
      `${this._baseUrl}/users/${userId}/documents/retirement-file`,
      {
        headers,
        responseType: 'arraybuffer',
      },
    );
  }

  /*
   * This method is allowed for ADMIN only
   */
  public confirmRegistration(id: string): Promise<void> {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${accessToken}`,
    );
    return lastValueFrom(
      this.http.post<void>(
        `${this._baseUrl}/registrations/${id}/confirm`,
        {},
        { headers },
      ),
    );
  }

  public fetchOwnedUserDocument(
    docType: 'LINKING_CERTIFICATE' | 'APPROVAL_LETTER',
  ) {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${accessToken}`,
    );

    return this.http.get(`${this._baseUrl}/documents/${docType}`, {
      headers,
      responseType: 'arraybuffer',
    });
  }

  public uploadUserDocument(
    userId: string,
    docType: 'LINKING_CERTIFICATE' | 'APPROVAL_LETTER',
    uploadedFile: File,
  ) {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${accessToken}`,
    );
    const formData = new FormData();

    formData.append('userId', userId);
    formData.append('docType', docType);
    formData.append('file', uploadedFile, uploadedFile.name);

    return this.http.post<RegisterResponse>(
      `${this._baseUrl}/documents`,
      formData,
      { headers },
    );
  }

  public getUserDocumentNameByUserId(
    userId: string,
    docType: 'LINKING_CERTIFICATE' | 'APPROVAL_LETTER',
  ) {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${accessToken}`,
    );

    return this.http.get<{
      name: string;
    }>(`${this._baseUrl}/users/${userId}/documents/name/${docType}`, {
      headers,
    });
  }

  public fetchUserDocumentByUserId(
    userId: string,
    docType: 'LINKING_CERTIFICATE' | 'APPROVAL_LETTER',
  ) {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${accessToken}`,
    );

    return this.http.get(
      `${this._baseUrl}/users/${userId}/documents/${docType}`,
      {
        headers,
        responseType: 'arraybuffer',
      },
    );
  }
}
