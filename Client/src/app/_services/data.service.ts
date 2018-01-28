import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {AreaData} from '../_models/AreaData';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiDataService {

  constructor(private http: HttpClient) {}

  // Uses http.get() to load data from a single API endpoint
  getWardData(ward_id: string): Observable<AreaData> {
    return this.http.get<AreaData>('/api/ward_data', {
      params: {
        id: ward_id
      }
    });
  }

  getGlasgowData(): Observable<AreaData> {
    return this.http.get<AreaData>('/api/glasgow_data');
  }
}

