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
  VarietiesName?: string;
  VarietiesImg?: string;
  VarietiesDecs?: string;
  CreateBy?: number;
  UpdateBy: number;
  CreateDate?: Date;
  UpdateDate: Date;
  Active: boolean;
}
