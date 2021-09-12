import { Component, OnInit, TemplateRef } from '@angular/core';
import { PopupService } from 'src/app/service/popup.service';
import { ShoppingCart } from 'src/app/model/sys.model';
import { DataService } from 'src/app/service/data.service';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
  public shoppingCartList: Array<ShoppingCart> = [];
  public shoppingCart: ShoppingCart = {
    VarietiesID: 0,
    VarietiesName: '',
    GradeCode: '',
    GradeName: '',
    SellingPrice: 0,
    Amount: 0,
    TotalPrice: 0,
  };

  public sumTotalPrice: number = 0;

  public countShoppingCart: number = 0;

  constructor(
    private popup: PopupService,
    public alert: AlertService,
    public dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getShoppingCartList();
    this.dataService.currentCountShoppingCart.subscribe(
      (countShoppingCart) => (this.countShoppingCart = countShoppingCart)
    );
  }

  openShoppingCart(content: TemplateRef<any>) {
    this.getShoppingCartList();
    this.popup.open_xl(content);
  }

  getShoppingCartList() {
    var shoppingCartList = JSON.parse(
      localStorage.getItem('shoppingCartList') || '{}'
    );
    if (shoppingCartList != '{}') {
      this.shoppingCartList = shoppingCartList || [];
    }

    this.dataService.changeCountShoppingCart(this.shoppingCartList.length);
    this.sumPrice();
  }

  changePrice(index: number) {
    if (this.shoppingCartList[index].Amount == 0) {
      this.alert.warn('กรอกราคา มากกว่า 0');
      this.shoppingCartList[index].Amount = 1;
    }

    this.shoppingCartList[index].TotalPrice =
      this.shoppingCartList[index].Amount *
      this.shoppingCartList[index].SellingPrice;
    localStorage.setItem(
      'shoppingCartList',
      JSON.stringify(this.shoppingCartList)
    );
    this.sumPrice();
  }

  deleteShoppingCartList(shoppingCart: ShoppingCart) {
    this.alert.conf('ต้องการลบรายการทุเรียน ใช่หรือไม่').then((d) => {
      if (d.isConfirmed) {
        this.shoppingCartList = this.shoppingCartList.filter(
          (obj) => obj !== shoppingCart
        );
        this.dataService.changeCountShoppingCart(this.shoppingCartList.length);
        localStorage.setItem(
          'shoppingCartList',
          JSON.stringify(this.shoppingCartList)
        );
        this.sumPrice();
      }
    });
  }

  sumPrice() {
    this.sumTotalPrice = 0;
    this.shoppingCartList.forEach((a) => (this.sumTotalPrice += a.TotalPrice));
  }
}
