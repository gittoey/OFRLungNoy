import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../model/sys.model';
import { DataService } from './data.service';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root',
})
export class SysService {
  private auth: Auth = {
    UserID: -1,
    AuthToken:'',
    Name: '',
  };

  constructor(private dataService: DataService, private router: Router) {}

  async ckLogin(): Promise<Auth> {
    const md5 = new Md5();
    this.auth = JSON.parse(
      localStorage.getItem('currentUser') || '{}'
    );
    
    const Auth = md5.appendStr("AuthLuePeeCo<<>>"+ this.auth.UserID.toString()).end();

    if (Auth != this.auth.AuthToken) {
      this.router.navigate(['/login']);
    }
    return this.auth;
  }
}
