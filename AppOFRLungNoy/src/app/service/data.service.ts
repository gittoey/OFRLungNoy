import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private countShoppingCartSource = new BehaviorSubject<number>(0);
  public currentCountShoppingCart = this.countShoppingCartSource.asObservable();

  constructor() { }

  changeCountShoppingCart(countShoppingCart:number){
    this.countShoppingCartSource.next(countShoppingCart)
  }
}
