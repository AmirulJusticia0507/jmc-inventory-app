export interface User {
  id: string;
  username: string;
  nama: string;
  email: string;
  role: 'Admin' | 'Operator';
  isLocked: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  subCategories?: SubCategory[];
  _count?: { incomingGoods: number };
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  priceLimit: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  _count?: { incomingGoods: number };
}

export interface IncomingGoodItem {
  id: string;
  incomingGoodId: string;
  itemCode: string;
  itemName: string;
  price: number;
  quantity: number;
  unit: string;
  totalPrice: number;
  expiredDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IncomingGood {
  id: string;
  transactionDate: string;
  operatorId: string;
  categoryId: string;
  subCategoryId: string;
  source: string;
  letterNumber: string | null;
  attachmentPath: string | null;
  isVerified: boolean;
  grandTotal: number;
  createdAt: string;
  updatedAt: string;
  operator?: User;
  category?: Category;
  subCategory?: SubCategory;
  items?: IncomingGoodItem[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface IncomingGoodQuery {
  page?: number;
  limit?: number;
  categoryId?: string;
  subCategoryId?: string;
  year?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}