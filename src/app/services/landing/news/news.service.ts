import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, lastValueFrom } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import { Pagination } from '../../shared/misc/pagination.interfaces';
import {
  NewsBaseInfoBody,
  NewsCategory,
  NewsCategorySummary,
  NewsCreateInfo,
  NewsFilterCriteria,
  NewsPoster,
  NewsResource,
  NewsSearchRecommendation,
  NewsTag,
  NewsTagSummary,
  NewsYearlySummary,
} from './news.interfaces';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private _baseUrl: string = `${environment.baseUrl}/news`;

  constructor(private readonly http: HttpClient) {}

  public fetchAllNewsSearchRecommendations(
    searchTerm: string,
  ): Observable<any> {
    return this.http.get<NewsSearchRecommendation[]>(
      `${this._baseUrl}/recommendations?search=${searchTerm}`,
    );
  }

  public fetchTags(): Observable<NewsTag[]> {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders();
    headers.append('Authorization', `Bearer ${accessToken}`);
    return this.http.get<NewsTag[]>(`${this._baseUrl}/tags`, {
      headers,
    });
  }

  public createTag(tagName: string): Observable<NewsTag> {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}`,
    );
    return this.http.post<NewsTag>(
      `${this._baseUrl}/tag`,
      {
        name: tagName,
      },
      { headers },
    );
  }

  public createCategory(categoryName: string): Observable<NewsCategory> {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${accessToken}`,
    );
    return this.http.post<NewsCategory>(
      `${this._baseUrl}/category`,
      {
        name: categoryName,
      },
      { headers },
    );
  }

  public createNews(newsInfo: NewsCreateInfo): Observable<{ urlName: string }> {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );

    const { baseInfo, resources } = newsInfo;

    return this.http.post<{ urlName: string }>(
      `${this._baseUrl}`,
      {
        ...baseInfo,
        resources: resources.map(({ TYPE, ...rest }) => ({
          resourceType: TYPE,
          content: JSON.stringify(rest),
        })),
      },
      { headers },
    );
  }

  public fetchNewsPosters(
    pagination: Pagination,
    filterCriteria?: NewsFilterCriteria,
  ) {
    const otherParams: { [key: string]: string | number } = {};
    if (filterCriteria) {
      Object.keys(filterCriteria).forEach((key) => {
        if (
          filterCriteria[key as keyof NewsFilterCriteria] !== undefined &&
          filterCriteria[key as keyof NewsFilterCriteria] !== null
        ) {
          otherParams[key as keyof NewsFilterCriteria] =
            filterCriteria[key as keyof NewsFilterCriteria]!;
        }
      });
    }

    const params = new HttpParams()
      .append('page', pagination.pagina.toString())
      .append('size', pagination.cantidad.toString())
      .appendAll(otherParams);

    return lastValueFrom(
      this.http.get<{ count: number; records: NewsPoster[] }>(this._baseUrl, {
        params,
      }),
    );
  }

  public removeNewsPoster(id: number): Promise<any> {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    return lastValueFrom(
      this.http.delete<{ id: number }>(`${this._baseUrl}/${id}`, { headers }),
    );
  }

  public fetchCategories() {
    return this.http.get<NewsCategory[]>(`${this._baseUrl}/categories`, {
      responseType: 'json',
      observe: 'body',
    });
  }

  public fetchMainNews(
    pagination: Pagination,
    filterCriteria?: NewsFilterCriteria,
  ) {
    const otherParams: { [key: string]: string | number } = {};
    if (filterCriteria) {
      Object.keys(filterCriteria).forEach((key) => {
        if (
          filterCriteria[key as keyof NewsFilterCriteria] !== undefined &&
          filterCriteria[key as keyof NewsFilterCriteria] !== null
        ) {
          otherParams[key as keyof NewsFilterCriteria] =
            filterCriteria[key as keyof NewsFilterCriteria]!;
        }
      });
    }

    const params = new HttpParams()
      .append('page', pagination.pagina.toString())
      .append('size', pagination.cantidad.toString())
      .appendAll(otherParams);

    return lastValueFrom(
      this.http.get<{ count: number; records: NewsPoster[] }>(this._baseUrl, {
        params,
      }),
    );
  }

  public fetchNewsDetail(urlName: string): Observable<NewsPoster> {
    return this.http.get<NewsPoster>(`${this._baseUrl}/${urlName}`);
  }

  public editTag(tag: NewsTag) {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    return this.http.put<void>(
      `${this._baseUrl}/tag`,
      {
        ...tag,
      },
      { headers },
    );
  }

  public editCategory(category: NewsCategory) {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    return this.http.put<void>(
      `${this._baseUrl}/category`,
      {
        ...category,
      },
      { headers },
    );
  }

  public getNewsCategorySummaries(pagination: Pagination, search: string = '') {
    const params = new HttpParams()
      .append('page', pagination.pagina.toString())
      .append('size', pagination.cantidad.toString())
      .append('search', search);
    return lastValueFrom(
      this.http.get<NewsCategorySummary[]>(
        `${this._baseUrl}/category-summaries`,
        { params },
      ),
    );
  }

  public getNewsTagsSummaries(pagination: Pagination, search: string = '') {
    const params = new HttpParams()
      .append('page', pagination.pagina.toString())
      .append('size', pagination.cantidad.toString())
      .append('search', search);
    return lastValueFrom(
      this.http.get<NewsTagSummary[]>(`${this._baseUrl}/tag-summaries`, {
        params,
      }),
    );
  }

  public fetchYearlySummaries(year?: number) {
    if (!year) {
      return lastValueFrom(
        this.http.get<NewsYearlySummary[]>(
          `${this._baseUrl}/monthly-summaries`,
        ),
      );
    }
    return lastValueFrom(
      this.http.get<NewsYearlySummary[]>(
        `${this._baseUrl}/monthly-summaries?year=${year}`,
      ),
    );
  }

  public updateNews(newsInfo: NewsCreateInfo): Observable<{ urlName: string }> {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    const { baseInfo, resources } = newsInfo;
    return this.http.put<{ urlName: string }>(
      `${this._baseUrl}/${newsInfo.baseInfo.id}`,
      {
        ...baseInfo,
        resources: resources.map(({ TYPE, ...rest }) => ({
          resourceType: TYPE,
          content: JSON.stringify(rest),
        })),
      },
      { headers },
    );
  }
}
