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
    const bearer = md5.appendStr('TOEY<>' + apiName).end();
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: 'Bearer ' + bearer,
    };
    const body = JSON.stringify(data);
    return await this.http
      .post(environment.apiHost + apiName, body, {
        headers: headers,
      })
      .toPromise();
  }

  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();

  setFormDataFile(_formData: FormData, index: string, event: any) {
    const fileList: FileList = event.target.files;
    //check whether file is selected or not
    if (fileList.length > 0) {
      const file = fileList[0];
      _formData.append(index, file, file.name);
    }
  }

  setFormData(_formData: FormData, index: string, data: any) {
    _formData.append(index, data);
  }

  async uploadFile(apiName: string, _formData: FormData) {
    const md5 = new Md5();
    const bearer = md5.appendStr('TOEY<>' + apiName).end();
    const headers = {
      Authorization: 'Bearer ' + bearer
    };
    return await this.http
      .post(environment.apiHost + apiName, _formData, {
        headers: headers,
      })
      .toPromise();
  }

  async cu(_Conn:any){
    return await this.post('cu_db.php', _Conn)
  }
}
