import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Auth } from '../model/sys.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private countShoppingCartSource = new BehaviorSubject<number>(0);
  public currentCountShoppingCart = this.countShoppingCartSource.asObservable();

  private UserName = new BehaviorSubject<string>('');
  public currentUserName = this.UserName.asObservable();

  constructor() {}

  changeCountShoppingCart(countShoppingCart: number) {
    this.countShoppingCartSource.next(countShoppingCart);
  }

  changeUserName(name: string) {
    this.UserName.next(name);
  }
}
