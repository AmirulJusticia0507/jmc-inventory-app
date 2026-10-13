export declare class IncomingGoodItemDto {
    itemCode: string;
    itemName: string;
    price: number;
    quantity: number;
    unit: string;
    expiredDate?: string;
}
export declare class CreateIncomingGoodDto {
    transactionDate: string;
    categoryId: string;
    subCategoryId: string;
    source: string;
    letterNumber?: string;
    attachmentPath?: string;
    operatorId?: string;
    items: IncomingGoodItemDto[];
}
export declare class UpdateIncomingGoodDto {
    transactionDate?: string;
    categoryId?: string;
    subCategoryId?: string;
    source?: string;
    letterNumber?: string;
    attachmentPath?: string;
    operatorId?: string;
    items?: IncomingGoodItemDto[];
}
export declare class IncomingGoodQueryDto {
    page?: number;
    limit?: number;
    categoryId?: string;
    subCategoryId?: string;
    year?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class ToggleVerifiedDto {
    isVerified: boolean;
}
