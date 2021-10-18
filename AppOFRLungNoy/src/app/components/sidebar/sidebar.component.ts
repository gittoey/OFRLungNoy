import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/model/sys.model';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    permission: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/home', title: 'Home',  icon: 'ni-tv-2 text-default', class: '', permission:'' },
    { path: '/shop', title: 'ทุเรียน',  icon: 'ni-shop text-primary', class: '', permission:'' },
    { path: '/user-profile', title: 'User profile',  icon:'ni-single-02 text-yellow', class: '', permission:'US' },
    { path: '/orders', title: 'รายการสั่งจอง',  icon:'ni ni-bullet-list-67 text-default', class: '', permission:'US' },
    //{ path: '/login', title: 'Login',  icon:'ni-key-25 text-info', class: '', permission:'US' },
    { path: '/durian-master-data', title: 'จัดการข้อมูลทุเรียน',  icon:'ni-archive-2 text-info', class: '', permission:'AM' },
    { path: '/post-feeds', title: 'แจ้งข่าวสาร',  icon:'ni-laptop text-primary', class: '', permission:'AM' },
    { path: '/check-order', title: 'ตรวจสอบรายการสั่งจอง',  icon:'ni ni-bullet-list-67 text-default', class: '', permission:'AM' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems!: any[];
  public isCollapsed = true;

  public auth:Auth = {
    UserID: -1,
    AuthToken: '',
    Name: '',
    UserType: ''
  };

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });

   this.auth = JSON.parse(
    localStorage.getItem('currentUser') || '{}'
  );
  }
}
