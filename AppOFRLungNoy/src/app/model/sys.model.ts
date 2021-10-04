import { Oder } from "./db.model";

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
}

export interface SysOder {
  OderID: number;
  OderNo: string;
  UserID: number;
  AddressText: string;
  ProvinceID: number;
  DistrictID: number;
  SubDistrictID: number;
  Remark: string;
  StatusCode: string;
  CreateBy: number;
  UpdateBy: number;
  CreateDate: Date;
  UpdateDate: Date;
  Active: boolean;
  TotalAmount : number;
  TotalPrice : number;
}