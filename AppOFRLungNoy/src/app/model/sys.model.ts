import { Oder, OderDetail } from './db.model';

export interface ShoppingCart {
  VarietiesID: number;
  VarietiesName: string;
  GradeCode: string;
  GradeName: string;
  SellingPrice: number;
  Amount: number;
  TotalPrice: number;
}

export interface Auth {
  UserID: number;
  AuthToken: string;
  Name: string;
  UserType: string;
}

export interface SysOder extends Oder {
  ConfigDisplay: string;
  TotalAmount: number;
  TotalPrice: number;
}

export interface SysOderDetail extends OderDetail {
  ConfigDisplay: string;
  Name: string;
  TotalPrice: number;
}
