import { Order, OrderDetail } from './db.model';

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

export interface SysOrder extends Order {
  ConfigDisplay: string;
  TotalAmount: number;
  TotalPrice: number;
}

export interface SysOrderDetail extends OrderDetail {
  ConfigDisplay: string;
  Name: string;
  TotalPrice: number;
}

export interface SysCheckOrder extends SysOrder {
  OrderByName: string;
}
