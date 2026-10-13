import { IncomingGoodsService } from './incoming-goods.service';
import { CreateIncomingGoodDto, UpdateIncomingGoodDto, IncomingGoodQueryDto, ToggleVerifiedDto } from './dto';
import { Response } from 'express';
export declare class IncomingGoodsController {
    private incomingGoodsService;
    constructor(incomingGoodsService: IncomingGoodsService);
    create(createDto: CreateIncomingGoodDto, user: {
        id: string;
        role: string;
    }): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
        };
        subCategory: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string;
            priceLimit: import("@prisma/client/runtime/library").Decimal;
        };
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            itemCode: string;
            itemName: string;
            price: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            unit: string;
            expiredDate: Date | null;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            incomingGoodId: string;
        }[];
        operator: {
            username: string;
            id: string;
            nama: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        transactionDate: Date;
        subCategoryId: string;
        source: string;
        letterNumber: string | null;
        attachmentPath: string | null;
        operatorId: string;
        grandTotal: import("@prisma/client/runtime/library").Decimal;
        isVerified: boolean;
    }>;
    findAll(query: IncomingGoodQueryDto, user: {
        id: string;
        role: string;
    }): Promise<{
        data: ({
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
            };
            subCategory: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                categoryId: string;
                priceLimit: import("@prisma/client/runtime/library").Decimal;
            };
            items: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                itemCode: string;
                itemName: string;
                price: import("@prisma/client/runtime/library").Decimal;
                quantity: number;
                unit: string;
                expiredDate: Date | null;
                totalPrice: import("@prisma/client/runtime/library").Decimal;
                incomingGoodId: string;
            }[];
            operator: {
                username: string;
                id: string;
                nama: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string;
            transactionDate: Date;
            subCategoryId: string;
            source: string;
            letterNumber: string | null;
            attachmentPath: string | null;
            operatorId: string;
            grandTotal: import("@prisma/client/runtime/library").Decimal;
            isVerified: boolean;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    exportExcel(query: IncomingGoodQueryDto, user: {
        id: string;
        role: string;
    }, res: Response): Promise<void>;
    findOne(id: string, user: {
        id: string;
        role: string;
    }): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
        };
        subCategory: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string;
            priceLimit: import("@prisma/client/runtime/library").Decimal;
        };
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            itemCode: string;
            itemName: string;
            price: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            unit: string;
            expiredDate: Date | null;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            incomingGoodId: string;
        }[];
        operator: {
            username: string;
            id: string;
            nama: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        transactionDate: Date;
        subCategoryId: string;
        source: string;
        letterNumber: string | null;
        attachmentPath: string | null;
        operatorId: string;
        grandTotal: import("@prisma/client/runtime/library").Decimal;
        isVerified: boolean;
    }>;
    update(id: string, updateDto: UpdateIncomingGoodDto, user: {
        id: string;
        role: string;
    }): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
        };
        subCategory: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string;
            priceLimit: import("@prisma/client/runtime/library").Decimal;
        };
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            itemCode: string;
            itemName: string;
            price: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            unit: string;
            expiredDate: Date | null;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            incomingGoodId: string;
        }[];
        operator: {
            username: string;
            id: string;
            nama: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        transactionDate: Date;
        subCategoryId: string;
        source: string;
        letterNumber: string | null;
        attachmentPath: string | null;
        operatorId: string;
        grandTotal: import("@prisma/client/runtime/library").Decimal;
        isVerified: boolean;
    }>;
    toggleVerified(id: string, toggleDto: ToggleVerifiedDto, user: {
        id: string;
        role: string;
    }): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
        };
        subCategory: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string;
            priceLimit: import("@prisma/client/runtime/library").Decimal;
        };
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            itemCode: string;
            itemName: string;
            price: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            unit: string;
            expiredDate: Date | null;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            incomingGoodId: string;
        }[];
        operator: {
            username: string;
            id: string;
            nama: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        transactionDate: Date;
        subCategoryId: string;
        source: string;
        letterNumber: string | null;
        attachmentPath: string | null;
        operatorId: string;
        grandTotal: import("@prisma/client/runtime/library").Decimal;
        isVerified: boolean;
    }>;
    remove(id: string, user: {
        id: string;
        role: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        transactionDate: Date;
        subCategoryId: string;
        source: string;
        letterNumber: string | null;
        attachmentPath: string | null;
        operatorId: string;
        grandTotal: import("@prisma/client/runtime/library").Decimal;
        isVerified: boolean;
    }>;
}
