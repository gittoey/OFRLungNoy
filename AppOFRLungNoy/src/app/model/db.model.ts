export interface User {
  UserID: number;
  Type: string;
  Username: string;
  Password: string;
  Name: string;
  AddressText: string;
  ProvinceID: number;
  DistrictID: number;
  SubDistrictID: number;
  Active: boolean;
  NewDate: Date;
  UpdateDate: Date;
}

export interface Varieties {
  VarietiesID: number;
  Name?: string;
  Img?: string;
  Meat?: string;
  Smell?: string;
  Flavor?: string;
  DeliciousTerm?: string;
  Decs?: string;
  CreateBy?: number;
  UpdateBy: number;
  CreateDate?: Date;
  UpdateDate: Date;
  Active: boolean;
}

export interface SystemConfig {
  SystemConfigID: number;
  ConfigCode?: string;
  ConfigValue?: string;
  ConfigDisplay?: string;
  Description?: string;
  CreateBy?: number;
  UpdateBy: number;
  CreateDate?: Date;
  UpdateDate: Date;
  Active: boolean;
}

export interface Price {
  PriceID: number;
  VarietiesID: number;
  GradeCode?: string;
  CostPrice?: number;
  SellingPrice?: number;
  Stock: number;
  CreateBy?: number;
  UpdateBy: number;
  CreateDate?: Date;
  UpdateDate: Date;
  Active: boolean;
}

export interface Province {
  ProvinceID: number;
  Code: string;
  NameInThai: string;
  NameInEnglish: string;
}

export interface District {
  DistrictID: number;
  ProvinceID: number;
  Code: string;
  NameInThai: string;
  NameInEnglish: string;
}

export interface SubDistrict {
  SubDistrictID: number;
  DistrictID: number;
  Code: string;
  NameInThai: string;
  NameInEnglish: string;
  Latitude: number;
  Longitude: number;
  ZipCode: number;
}

export interface Order {
  OrderID: number;
  OrderNo: string;
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
}

export interface OrderDetail {
  OrderDetailID: number;
  OrderID: number;
  VarietiesID: number;
  GradeCode: string;
  SellingPrice: number;
  Amount: number;
  Unit: number;
  CreateBy: number;
  UpdateBy: number;
  CreateDate: Date;
  UpdateDate: Date;
  Active: boolean;
}

export interface Feed {
  FeedID: number;
  Title: string;
  Img: string;
  Text: string;
  CreateBy: number;
  UpdateBy: number;
  CreateDate: Date;
  UpdateDate: Date;
  Active: boolean;
}

export interface OrderPayment {
  OrderPaymentID: number;
  OrderID: number;
  PaymentDate: string;
  PaymentImg: string;
  CreateBy: number;
  UpdateBy: number;
  CreateDate: Date;
  UpdateDate: Date;
  Active: boolean;
}
