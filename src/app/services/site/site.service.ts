import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Site } from 'src/app/models/site.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  constructor(private http: HttpClient) {}

  public getSite(): Observable<Site> {
    return this.http.get<Site>('/assets/exampleSite.json');
  }
}
