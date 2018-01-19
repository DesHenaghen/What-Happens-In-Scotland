import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DataService {

  constructor(private http: HttpClient) {}

  // Uses http.get() to load data from a single API endpoint
  getWardData(ward_id: string) {
    return this.http.get<any[]>('/api/ward_data', {
      params: {
        id: ward_id
      }
    });
  }

  getGlasgowData() {
    return this.http.get<any[]>('/api/glasgow_data');
  }

  getWards() {
    return this.http.get<any>('/api/wards');
  }
}

