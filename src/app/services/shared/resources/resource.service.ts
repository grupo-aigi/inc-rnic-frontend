import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, lastValueFrom, map } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import { ImageDirectory, UploadedFile } from './resource.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ResourcesService {
  private _baseUrl: string = environment.baseUrl;

  public constructor(private http: HttpClient) {}

  // public fetchImageById(
  //   elementType: ImageDirectory,
  //   imageName: string,
  // ): Observable<Blob> {
  //   // I need to fetch an image from my server based on the id of the image.
  //   return this.http
  //     .get(
  //       `${this._baseUrl}/${elementType.toLowerCase()}/images/${imageName}`,
  //       { responseType: 'blob' },
  //     )
  //     .pipe(
  //       map((value) => {
  //         const type = imageName.split('.').pop();
  //         return new Blob([value], {
  //           type: `image/${type}`,
  //         });
  //       }),
  //     );
  // }

  public fetchFileById(elementType: string, filename: string) {
    return this.http.get(
      `${this._baseUrl}/${elementType.toLowerCase()}/files/${filename}`,
      { responseType: 'blob' },
    );
  }

  public createImage(
    elementType: ImageDirectory,
    file: File,
  ): Observable<{ filename: string }> {
    const formData = new FormData();
    formData.append(
      'image',
      // new Blob([file], { type: this.getContentType(file) }),
      file,
    );

    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}`,
    );

    return this.http.post<{ filename: string }>(
      `${this._baseUrl}/${elementType}/image`,
      formData,
      { headers },
    );
  }

  public createFile(
    elementType: string,
    file: File,
    filename: string,
  ): Observable<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file, filename);

    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}`,
    );

    return this.http.post<UploadedFile>(
      `${this._baseUrl}/${elementType}/file`,
      formData,
      { headers },
    );
  }

  public getAllImageNames(
    elementType: ImageDirectory,
    pagination: { skip: number; limit: number },
  ): Observable<string[]> {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}`,
    );
    return this.http
      .get<any>(
        `${this._baseUrl}/${elementType}/images?skip=${pagination.skip}&limit=${pagination.limit}`,
        { headers, responseType: 'json', observe: 'body' },
      )
      .pipe(map((images) => images as string[]));
  }

  public getAllOwnedUserAvatarImages(pagination: {
    skip: number;
    limit: number;
  }): Observable<string[]> {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}`,
    );
    return this.http
      .get<any>(
        `${this._baseUrl}/profiles/owned-avatars?skip=${pagination.skip}&limit=${pagination.limit}`,
        { headers, responseType: 'json', observe: 'body' },
      )
      .pipe(map(({ value }) => value as string[]));
  }

  public getUserAvatarImageByUserId(userId: string) {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}`,
    );

    return this.http
      .get(`${this._baseUrl}/profiles/avatars/id/${userId}`, {
        responseType: 'blob',
        headers,
      })
      .pipe(
        map((value) => {
          return new Blob([value], {
            // type: `image/png`,
          });
        }),
      );
  }

  public getUserAvatarImageByName(imageName: string) {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}`,
    );
    return this.http
      .get(`${this._baseUrl}/profiles/images/${imageName}`, {
        responseType: 'blob',
        headers,
      })
      .pipe(
        map((value) => {
          return new Blob([value], {
            // type: `image/png`,
          });
        }),
      );
  }

  public saveUserAvatarImage(uploadedImage: File) {
    const formData = new FormData();
    formData.append(
      'image',
      // new Blob([file], { type: this.getContentType(file) }),
      uploadedImage,
    );

    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}`,
    );

    return this.http.post<{ imageName: string }>(
      `${this._baseUrl}/profiles/avatar`,
      formData,
      { headers },
    );
  }

  public updateUserAvatarImage(imageName: string) {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}`,
    );

    return lastValueFrom(
      this.http.put<{ imageName: string }>(
        `${this._baseUrl}/profiles/avatar`,
        { imageName },
        { headers },
      ),
    );
  }

  public getImageUrlByName(elementType: ImageDirectory, name: string) {
    return `${this._baseUrl}/${elementType.toLowerCase()}/images/${name}`;
  }

  public getFileUrlByName(
    elementType: ImageDirectory,
    name: string,
    originalFilename?: string,
  ) {
    const resourceUrl = `${this._baseUrl}/${elementType.toLowerCase()}/files/${name}`;
    if (originalFilename) {
      return `${resourceUrl}?originalFilename=${originalFilename}`;
    }
    return resourceUrl;
  }
}
