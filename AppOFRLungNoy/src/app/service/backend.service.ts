import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(private http: HttpClient) {}

  async post(apiName: string, data: any) {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(data);
    return await this.http.post(environment.apiHost+apiName, body, {
      headers: headers,
    }).toPromise();
  }

  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();

  public userlogin(username: string, password: string) {
        this.getLoggedInName.emit(true);
  }
}
