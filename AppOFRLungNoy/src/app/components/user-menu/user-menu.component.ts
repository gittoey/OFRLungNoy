import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { Auth } from 'src/app/model/sys.model';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  public auth:Auth ={
    UserID: 0,
    AuthToken:'',
    Name: ''
  };

  constructor(private dataService:DataService) { }

  ngOnInit(): void {
    this.auth = JSON.parse(
      localStorage.getItem('currentUser') || '{}'
    );
  }

}
