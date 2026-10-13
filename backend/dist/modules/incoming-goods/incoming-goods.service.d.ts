import { PrismaService } from '../../prisma/prisma.service';
import { CreateIncomingGoodDto, UpdateIncomingGoodDto, IncomingGoodQueryDto, ToggleVerifiedDto } from './dto';
import { Role } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
export declare class IncomingGoodsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateIncomingGoodDto, userId: string, userRole: Role): Promise<{
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
            priceLimit: Decimal;
        };
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            itemCode: string;
            itemName: string;
            price: Decimal;
            quantity: number;
            unit: string;
            expiredDate: Date | null;
            totalPrice: Decimal;
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
        grandTotal: Decimal;
        isVerified: boolean;
    }>;
    findAll(query: IncomingGoodQueryDto, userId: string, userRole: Role): Promise<{
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
                priceLimit: Decimal;
            };
            items: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                itemCode: string;
                itemName: string;
                price: Decimal;
                quantity: number;
                unit: string;
                expiredDate: Date | null;
                totalPrice: Decimal;
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
            grandTotal: Decimal;
            isVerified: boolean;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, userId: string, userRole: Role): Promise<{
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
            priceLimit: Decimal;
        };
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            itemCode: string;
            itemName: string;
            price: Decimal;
            quantity: number;
            unit: string;
            expiredDate: Date | null;
            totalPrice: Decimal;
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
        grandTotal: Decimal;
        isVerified: boolean;
    }>;
    update(id: string, updateDto: UpdateIncomingGoodDto, userId: string, userRole: Role): Promise<{
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
            priceLimit: Decimal;
        };
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            itemCode: string;
            itemName: string;
            price: Decimal;
            quantity: number;
            unit: string;
            expiredDate: Date | null;
            totalPrice: Decimal;
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
        grandTotal: Decimal;
        isVerified: boolean;
    }>;
    toggleVerified(id: string, toggleDto: ToggleVerifiedDto, userId: string, userRole: Role): Promise<{
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
            priceLimit: Decimal;
        };
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            itemCode: string;
            itemName: string;
            price: Decimal;
            quantity: number;
            unit: string;
            expiredDate: Date | null;
            totalPrice: Decimal;
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
        grandTotal: Decimal;
        isVerified: boolean;
    }>;
    remove(id: string, userId: string, userRole: Role): Promise<{
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
        grandTotal: Decimal;
        isVerified: boolean;
    }>;
    exportExcel(query: IncomingGoodQueryDto, userId: string, userRole: Role): Promise<({
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
            priceLimit: Decimal;
        };
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            itemCode: string;
            itemName: string;
            price: Decimal;
            quantity: number;
            unit: string;
            expiredDate: Date | null;
            totalPrice: Decimal;
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
        grandTotal: Decimal;
        isVerified: boolean;
    })[]>;
    private calculateGrandTotal;
}
