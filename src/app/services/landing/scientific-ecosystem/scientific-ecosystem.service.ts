import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, delay, lastValueFrom, of } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import {
  ScientificEcosystemCategory,
  ScientificEcosystemCreateInfo,
  ScientificEcosystemData,
  ScientificEcosystemDetail,
  ScientificEcosystemPoster,
  ScientificEcosystemSearchRecommendation,
  ScientificEcosystemTag,
} from './scientific-ecosystem.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ScientificEcosystemService {
  private _baseUrl: string = `${environment.baseUrl}/scientific-ecosystem`;
  private _scientificEcosystemPosters: ScientificEcosystemPoster[] = [];

  public constructor(private readonly http: HttpClient) {}

  public get scientificEcosystemPosters() {
    return this._scientificEcosystemPosters;
  }

  public fetchScientificEcosystemDetailByUrlName(
    urlName: string,
  ): Observable<ScientificEcosystemData> {
    const sampleEcosystemData: ScientificEcosystemData = {
      id: 1,
      title: 'Cáncer Colorrecal',
      urlName: 'cancer-colorrectal',
      sections: [
        {
          TYPE: 'NOSOTROS',
          description: [
            'El cáncer colorrectal (CCR) es una de las neoplasias malignas más comunes en todo el mundo y una de las principales causas de muerte por cáncer. En los últimos años, la incidencia y mortalidad del CCR han aumentado significativamente en muchos países, lo que subraya la importancia de abordar este problema de salud pública de manera integral.',
          ],
        },
        {
          TYPE: 'OBJ_GENERAL',
          generalObjective:
            'El objetivo general de este ecosistema científico es fomentar la colaboración interdisciplinaria entre investigadores, profesionales de la salud, pacientes y otras partes interesadas para avanzar en la comprensión, prevención, diagnóstico y tratamiento del cáncer colorrectal.',
        },
        {
          TYPE: 'OBJ_ESPECIFICOS',
          specificObjectives: [
            'Promover la investigación básica y clínica sobre los mecanismos moleculares y genéticos del CCR.',
            'Desarrollar y validar nuevas estrategias de detección temprana y diagnóstico del CCR.',
            'Mejorar las opciones de tratamiento y manejo del CCR a través de ensayos clínicos y estudios observacionales.',
            'Fomentar la educación y concienciación sobre el CCR entre la población general y los profesionales de la salud.',
            'Facilitar la creación de redes de colaboración entre instituciones académicas, centros de investigación, hospitales y organizaciones de pacientes.',
          ],
        },
        {
          TYPE: 'HOJA_RUTA',
          paragraphs: [
            "here are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
          ],
          images: [
            {
              cols: 3,
              imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
            },
            {
              cols: 3,
              imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
            },
          ],
          resources: [
            {
              filename: 'some-file-name.pdf',
              filetype: 'PDF',
              originalFilename: 'some-file-name.pdf',
              size: 300000,
            },
            {
              filename: 'some-file-name2.pdf',
              filetype: 'PDF',
              originalFilename: 'some-file-name2.pdf',
              size: 500000,
            },
          ],
        },
        {
          TYPE: 'LINEAMIENTOS',
          paragraphs: [
            "here are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
          ],
          images: [
            {
              cols: 3,
              imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
            },
            {
              cols: 3,
              imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
            },
          ],
          resources: [
            {
              filename: 'some-file-name.pdf',
              filetype: 'PDF',
              originalFilename: 'some-file-name.pdf',
              size: 300000,
            },
            {
              filename: 'some-file-name2.pdf',
              filetype: 'PDF',
              originalFilename: 'some-file-name2.pdf',
              size: 500000,
            },
          ],
        },
        {
          TYPE: 'INTEGRANTES',
          images: [
            {
              cols: 3,
              imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
            },
            {
              cols: 3,
              imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
            },
          ],
          paragraphs: [
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
            "here are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
          ],
          resources: [
            {
              filename: 'some-file-name.pdf',
              filetype: 'PDF',
              originalFilename: 'some-file-name.pdf',
              size: 300000,
            },
            {
              filename: 'some-file-name2.docx',
              filetype: 'WORD',
              originalFilename: 'some-file-name2.docx',
              size: 500000,
            },
            {
              filename: 'some-file-name3.csv',
              filetype: 'CSV',
              originalFilename: 'some-file-name3.csv',
              size: 500000,
            },
            {
              filename: 'some-file-name4.xlsx',
              filetype: 'EXCEL',
              originalFilename: 'some-file-name4.xlsx',
              size: 500000,
            },
          ],
        },
        {
          TYPE: 'PROYECTOS',
          paragraphs: [
            "here are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
          ],
          images: [
            {
              cols: 3,
              imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
            },
            {
              cols: 3,
              imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
            },
          ],
          resources: [
            {
              filename: 'some-file-name.pdf',
              filetype: 'PDF',
              originalFilename: 'some-file-name.pdf',
              size: 300000,
            },
            {
              filename: 'some-file-name2.docx',
              filetype: 'WORD',
              originalFilename: 'some-file-name2.docx',
              size: 500000,
            },
            {
              filename: 'some-file-name3.csv',
              filetype: 'CSV',
              originalFilename: 'some-file-name3.csv',
              size: 500000,
            },
            {
              filename: 'some-file-name4.xlsx',
              filetype: 'EXCEL',
              originalFilename: 'some-file-name4.xlsx',
              size: 500000,
            },
          ],
          projects: [
            {
              name: 'Proyecto 1',
              author: 'Nombre del autor',
              objectives: ['Objectivo 1', 'Objectivo 2'],
            },
            {
              name: 'Proyecto 2',
              author: 'Nombre del autor',
              objectives: ['Objectivo 3', 'Objectivo 4'],
            },
            {
              name: 'Proyecto 3',
              author: 'Nombre del autor',
              objectives: ['Objectivo 4', 'Objectivo 5'],
            },
          ],
        },
        {
          TYPE: 'EVENTOS',
          events: [
            {
              id: 1,
              title: 'Some event',
              description: 'Some event description',
              imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
              urlName: 'evento-de-prueba',
              startDate: new Date(),
              endDate: new Date(),
              author: 'Some author',
              scope: 'NATIONAL',
              category: {
                id: 1,
                name: 'Cáncer Colorrectal',
              },
              tags: [],
              resources: [],
            },
            {
              id: 2,
              title: 'Some event 2',
              description: 'Some event description',
              imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
              urlName: 'evento-de-prueba',
              startDate: new Date(),
              endDate: new Date(),
              author: 'Some author',
              scope: 'NATIONAL',
              category: {
                id: 1,
                name: 'Cáncer Colorrectal',
              },
              tags: [],
              resources: [],
            },
            {
              id: 3,
              title: 'Some event 3',
              description: 'Some event description',
              imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
              urlName: 'evento-de-prueba',
              startDate: new Date(),
              endDate: new Date(),
              author: 'Some author',
              scope: 'NATIONAL',
              category: {
                id: 1,
                name: 'Cáncer Colorrectal',
              },
              tags: [],
              resources: [],
            },
            {
              id: 3,
              title: 'Some event 3',
              description: 'Some event description',
              imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
              urlName: 'evento-de-prueba',
              startDate: new Date(),
              endDate: new Date(),
              author: 'Some author',
              scope: 'NATIONAL',
              category: {
                id: 1,
                name: 'Cáncer Colorrectal',
              },
              tags: [],
              resources: [],
            },
            {
              id: 3,
              title: 'Some event 3',
              description: 'Some event description',
              imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
              urlName: 'evento-de-prueba',
              startDate: new Date(),
              endDate: new Date(),
              author: 'Some author',
              scope: 'NATIONAL',
              category: {
                id: 1,
                name: 'Cáncer Colorrectal',
              },
              tags: [],
              resources: [],
            },
            {
              id: 3,
              title: 'Some event 3',
              description: 'Some event description',
              imageName: 'file-232d7554-6752-4519-bde1-390bb28fbd35.jpg',
              urlName: 'evento-de-prueba',
              startDate: new Date(),
              endDate: new Date(),
              author: 'Some author',
              scope: 'NATIONAL',
              category: {
                id: 1,
                name: 'Cáncer Colorrectal',
              },
              tags: [],
              resources: [],
            },
          ],
        },
        {
          TYPE: 'NOTICIAS',
          news: [
            {
              urlName: 'some-news-detail',
              createdAt: new Date(),
              updatedAt: new Date(),
              resources: [],
              title: 'Some news name',
              description: 'Some news description',
              author: 'Some author',
              date: new Date(),
              category: {
                id: 1,
                name: 'Cáncer Colorrectal',
              },
              tags: [],
              imageName: 'file-53c069f5-21b4-47a3-b8e1-b26558ee3d0d.png',
            },
            {
              urlName: 'some-news-detail',
              createdAt: new Date(),
              updatedAt: new Date(),
              resources: [],
              title: 'Some news name',
              description: 'Some news description',
              author: 'Some author',
              date: new Date(),
              category: {
                id: 1,
                name: 'Cáncer Colorrectal',
              },
              tags: [],
              imageName: 'file-53c069f5-21b4-47a3-b8e1-b26558ee3d0d.png',
            },
            {
              urlName: 'some-news-detail',
              createdAt: new Date(),
              updatedAt: new Date(),
              resources: [],
              title: 'Some news name',
              description: 'Some news description',
              author: 'Some author',
              date: new Date(),
              category: {
                id: 1,
                name: 'Cáncer Colorrectal',
              },
              tags: [],
              imageName: 'file-53c069f5-21b4-47a3-b8e1-b26558ee3d0d.png',
            },
            {
              urlName: 'some-news-detail',
              createdAt: new Date(),
              updatedAt: new Date(),
              resources: [],
              title: 'Some news name',
              description: 'Some news description',
              author: 'Some author',
              date: new Date(),
              category: {
                id: 1,
                name: 'Cáncer Colorrectal',
              },
              tags: [],
              imageName: 'file-53c069f5-21b4-47a3-b8e1-b26558ee3d0d.png',
            },
            {
              urlName: 'some-news-detail',
              createdAt: new Date(),
              updatedAt: new Date(),
              resources: [],
              title: 'Some news name',
              description: 'Some news description',
              author: 'Some author',
              date: new Date(),
              category: {
                id: 1,
                name: 'Cáncer Colorrectal',
              },
              tags: [],
              imageName: 'file-53c069f5-21b4-47a3-b8e1-b26558ee3d0d.png',
            },
            {
              urlName: 'some-news-detail',
              createdAt: new Date(),
              updatedAt: new Date(),
              resources: [],
              title: 'Some news name',
              description: 'Some news description',
              author: 'Some author',
              date: new Date(),
              category: {
                id: 1,
                name: 'Cáncer Colorrectal',
              },
              tags: [],
              imageName: 'file-53c069f5-21b4-47a3-b8e1-b26558ee3d0d.png',
            },
            {
              urlName: 'some-news-detail',
              createdAt: new Date(),
              updatedAt: new Date(),
              resources: [],
              title: 'Some news name',
              description: 'Some news description',
              author: 'Some author',
              date: new Date(),
              category: {
                id: 1,
                name: 'Cáncer Colorrectal',
              },
              tags: [],
              imageName: 'file-53c069f5-21b4-47a3-b8e1-b26558ee3d0d.png',
            },
          ],
        },
        {
          TYPE: 'CONTACTO',
          contacts: [
            {
              name: 'Pedro Pérez',
              role: 'Administrador',
              email: 'pedro.perez@gmail.com',
            },
            {
              name: 'Marina Pérez',
              role: 'Investigadora',
              email: 'marina.perez@gmail.com',
            },
            {
              name: 'Mario Pérez',
              role: 'Coordinador general',
              email: 'mario.perez@gmail.com',
            },
          ],
        },
      ],
    };
    return of(sampleEcosystemData).pipe(delay(1500));
  }

  public async fetchScientificEcosystemPosters(): Promise<
    ScientificEcosystemPoster[]
  > {
    const list: ScientificEcosystemPoster[] = [
      {
        id: 1,
        title: 'Ecosistema Cáncer Colorrectal',
        urlName: 'ecosistema-cancer-colorrectal',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: 'Ecosistema Cáncer de Mama',
        urlName: 'ecosistema-cancer-mama',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        title: 'Ecosistema Cáncer de Pulmón',
        urlName: 'ecosistema-cancer-pulmon',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return list;

    // return lastValueFrom(
    //   this.http.get<ScientificEcosystemPoster[]>(
    //     this._baseUrl,
    //   ),
    // );
  }

  public removeScientificEcosystem(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return lastValueFrom(
      this.http.delete<{ id: number }>(`${this._baseUrl}/${id}`, { headers }),
    );
  }

  public createCategory(
    categoryName: string,
  ): Observable<ScientificEcosystemCategory> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.post<ScientificEcosystemCategory>(
      `${this._baseUrl}/category`,
      {
        name: categoryName,
      },
      { headers },
    );
  }

  public createTag(tagName: string): Observable<ScientificEcosystemTag> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    });
    return this.http.post<ScientificEcosystemTag>(
      `${this._baseUrl}/tag`,
      {
        name: tagName,
      },
      { headers },
    );
  }

  public fetchAllScientificEcosystemSearchRecommendations(
    searchTerm: string,
    limit: number = 100,
  ): Observable<ScientificEcosystemSearchRecommendation[]> {
    return this.http.get<ScientificEcosystemSearchRecommendation[]>(
      `${this._baseUrl}/recommendations?search=${searchTerm}`,
    );
  }

  public fetchTags(): Observable<ScientificEcosystemTag[]> {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders();
    headers.append('Authorization', `Bearer ${accessToken}`);
    return this.http.get<ScientificEcosystemTag[]>(`${this._baseUrl}/tags`, {
      headers,
    });
  }

  public createScientificEcosystem(
    eventInfo: ScientificEcosystemCreateInfo,
  ): Observable<{ urlName: string }> {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );

    const { baseInfo, detail } = eventInfo;

    return this.http.post<{ urlName: string }>(
      `${this._baseUrl}`,
      {
        baseInfo,
        detail,
      },
      { headers },
    );
  }

  public fetchScientificEcosystemTypes() {
    const eventTypes = [
      { id: 0, es: 'Nacional', en: 'National' },
      { id: 1, es: 'Internacional', en: 'International' },
    ];
    return of(eventTypes);
  }

  public editTag(tag: ScientificEcosystemTag) {
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

  public editCategory(tag: ScientificEcosystemTag) {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    return this.http.put<void>(
      `${this._baseUrl}/category`,
      {
        ...tag,
      },
      { headers },
    );
  }

  public fetchCategories(): Observable<ScientificEcosystemCategory[]> {
    return this.http.get<ScientificEcosystemCategory[]>(
      `${this._baseUrl}/categories`,
      {
        responseType: 'json',
        observe: 'body',
      },
    );
  }

  public updateScientificEcosystem(
    eventInfo: ScientificEcosystemCreateInfo,
  ): Observable<{ urlName: string }> {
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${sessionStorage.getItem('access_token')}`,
    );
    const { baseInfo, detail } = eventInfo;
    return this.http.put<{ urlName: string }>(
      `${this._baseUrl}/${eventInfo.baseInfo.id}`,
      {
        baseInfo,
        detail,
      },
      { headers },
    );
  }

  public fetchScientificEcosystemDetail(
    scientificEcosystemUrlNameToEdit: string,
  ): Observable<ScientificEcosystemDetail> {
    return this.http.get<ScientificEcosystemDetail>(
      `${this._baseUrl}/${scientificEcosystemUrlNameToEdit}`,
    );
  }

  public fetchPdfDocument(filename: string) {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders().append(
      'authorization',
      `Bearer ${accessToken}`,
    );

    return lastValueFrom(
      this.http.request('GET', `${this._baseUrl}/files/${filename}`, {
        headers,
        responseType: 'arraybuffer',
      }),
    );
  }
}
