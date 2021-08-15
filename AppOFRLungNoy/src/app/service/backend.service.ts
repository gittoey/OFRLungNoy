import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(private http: HttpClient) {}

  async post(apiName: string, data: any) {
    const md5 = new Md5();
    const bearer = md5.appendStr("TOEY<>"+apiName).end();  
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json',
      'Authorization': 'Bearer '+bearer
    };
    const body = JSON.stringify(data);
    return await this.http
      .post(environment.apiHost + apiName, body, {
        headers: headers,
      })
      .toPromise();
  }

  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();

  public userlogin(username: string, password: string) {
    this.getLoggedInName.emit(true);
  }
}
