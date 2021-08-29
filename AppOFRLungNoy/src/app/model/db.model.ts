export interface User {
  UserID: number;
  Type: string;
  Username: string;
  Password: string;
  Name: string;
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
  DeliciousTerm ?: string;
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
  CreateBy?: number;
  UpdateBy: number;
  CreateDate?: Date;
  UpdateDate: Date;
  Active: boolean;
}
