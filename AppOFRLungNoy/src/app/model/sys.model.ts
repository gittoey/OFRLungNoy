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
