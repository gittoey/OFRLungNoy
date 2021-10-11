import { Component, OnInit } from '@angular/core';
import { SysService } from 'src/app/service/sys.service';
import { Auth } from 'src/app/model/sys.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  private auth:Auth = {
    UserID: -1,
    AuthToken: '',
    Name: '',
    UserType: ''
  };
  private userID: number = -1;

  constructor(private sysService: SysService) {}

  async ngOnInit() {
    this.auth = await this.sysService.ckLogin();

    console.log(this.userID);
  }
}
