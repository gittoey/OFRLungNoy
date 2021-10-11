import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { Auth } from 'src/app/model/sys.model';
import { AlertService } from 'src/app/service/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {
  public auth: Auth = {
    UserID: 0,
    AuthToken: '',
    Name: '',
    UserType: '',
  };

  constructor(
    private dataService: DataService,
    public alert: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth = JSON.parse(
      localStorage.getItem('currentUser') || "{}"
    );
  }

  logout(): void {
    this.alert.conf('ต้องการออกจากระบบ ใช่หรือไม่').then((d) => {
      if (d.isConfirmed) {
        localStorage.clear();
        this.router.navigate(['/home']);
      }
    });
  }
}
