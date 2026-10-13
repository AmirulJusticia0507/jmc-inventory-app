import { SubCategoriesService } from './sub-categories.service';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './dto';
export declare class SubCategoriesController {
    private subCategoriesService;
    constructor(subCategoriesService: SubCategoriesService);
    create(createSubCategoryDto: CreateSubCategoryDto): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        priceLimit: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAll(): Promise<({
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
        };
        _count: {
            incomingGoods: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        priceLimit: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    findOne(id: string): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
        };
        _count: {
            incomingGoods: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        priceLimit: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(id: string, updateSubCategoryDto: UpdateSubCategoryDto): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        priceLimit: import("@prisma/client/runtime/library").Decimal;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        priceLimit: import("@prisma/client/runtime/library").Decimal;
    }>;
}
