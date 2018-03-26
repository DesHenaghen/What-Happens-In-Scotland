import { TestBed, inject } from '@angular/core/testing';

import { WebSocketService } from './web-socket.service';
import {Subject} from 'rxjs/Subject';

describe('WebSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebSocketService]
    });
  });

  it('should be created', inject([WebSocketService], (service: WebSocketService) => {
    expect(service).toBeTruthy();
  }));

  it('should return a Subject from connect_scotland_districts', () => {
    const service: WebSocketService = TestBed.get(WebSocketService);
    expect(service.connect_scotland_districts() instanceof Subject).toBeTruthy();
  });

  it('should return a Subject from connect_scotland_wards', () => {
    const service: WebSocketService = TestBed.get(WebSocketService);
    expect(service.connect_scotland_wards() instanceof Subject).toBeTruthy();
  });
});
