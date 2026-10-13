"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomingGoodsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
let IncomingGoodsService = class IncomingGoodsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto, userId, userRole) {
        const subCategory = await this.prisma.subCategory.findUnique({
            where: { id: createDto.subCategoryId },
        });
        if (!subCategory) {
            throw new common_1.NotFoundException('Sub-category not found');
        }
        if (createDto.categoryId !== subCategory.categoryId) {
            throw new common_1.BadRequestException('Sub-category does not belong to the selected category');
        }
        const grandTotal = this.calculateGrandTotal(createDto.items);
        if (grandTotal > Number(subCategory.priceLimit)) {
            throw new common_1.BadRequestException(`Total harga barang (${grandTotal}) melebihi batas harga sub kategori (${subCategory.priceLimit})`);
        }
        let operatorId = userId;
        if (userRole === 'Admin' && createDto.operatorId) {
            operatorId = createDto.operatorId;
        }
        return this.prisma.incomingGood.create({
            data: {
                transactionDate: new Date(createDto.transactionDate),
                operatorId,
                categoryId: createDto.categoryId,
                subCategoryId: createDto.subCategoryId,
                source: createDto.source,
                letterNumber: createDto.letterNumber,
                attachmentPath: createDto.attachmentPath,
                grandTotal: new library_1.Decimal(grandTotal.toFixed(2)),
                items: {
                    create: createDto.items.map((item) => ({
                        itemCode: item.itemCode,
                        itemName: item.itemName,
                        price: new library_1.Decimal(item.price.toFixed(2)),
                        quantity: item.quantity,
                        unit: item.unit,
                        totalPrice: new library_1.Decimal((item.price * item.quantity).toFixed(2)),
                        expiredDate: item.expiredDate ? new Date(item.expiredDate) : null,
                    })),
                },
            },
            include: {
                operator: { select: { id: true, username: true, nama: true } },
                category: true,
                subCategory: true,
                items: true,
            },
        });
    }
    async findAll(query, userId, userRole) {
        const { page = 1, limit = 10, categoryId, subCategoryId, year, search, sortBy = 'transactionDate', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (userRole === 'Operator') {
            where.operatorId = userId;
        }
        if (categoryId)
            where.categoryId = categoryId;
        if (subCategoryId)
            where.subCategoryId = subCategoryId;
        if (year) {
            where.transactionDate = {
                gte: new Date(`${year}-01-01`),
                lt: new Date(`${year + 1}-01-01`),
            };
        }
        if (search) {
            where.OR = [
                { source: { contains: search, mode: 'insensitive' } },
                { subCategory: { name: { contains: search, mode: 'insensitive' } } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.incomingGood.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    operator: { select: { id: true, username: true, nama: true } },
                    category: true,
                    subCategory: true,
                    items: true,
                },
            }),
            this.prisma.incomingGood.count({ where }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, userId, userRole) {
        const incomingGood = await this.prisma.incomingGood.findUnique({
            where: { id },
            include: {
                operator: { select: { id: true, username: true, nama: true } },
                category: true,
                subCategory: true,
                items: true,
            },
        });
        if (!incomingGood) {
            throw new common_1.NotFoundException('Incoming good not found');
        }
        if (userRole === 'Operator' && incomingGood.operatorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return incomingGood;
    }
    async update(id, updateDto, userId, userRole) {
        const existing = await this.findOne(id, userId, userRole);
        if (userRole === 'Operator' && existing.operatorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        let operatorId = existing.operatorId;
        if (userRole === 'Admin' && updateDto.operatorId) {
            operatorId = updateDto.operatorId;
        }
        let grandTotal = Number(existing.grandTotal);
        if (updateDto.items) {
            grandTotal = this.calculateGrandTotal(updateDto.items);
            const subCategory = await this.prisma.subCategory.findUnique({
                where: { id: updateDto.subCategoryId || existing.subCategoryId },
            });
            if (subCategory && grandTotal > Number(subCategory.priceLimit)) {
                throw new common_1.BadRequestException(`Total harga barang (${grandTotal}) melebihi batas harga sub kategori (${subCategory.priceLimit})`);
            }
        }
        if (updateDto.items) {
            await this.prisma.incomingGoodItem.deleteMany({ where: { incomingGoodId: id } });
        }
        return this.prisma.incomingGood.update({
            where: { id },
            data: {
                transactionDate: updateDto.transactionDate ? new Date(updateDto.transactionDate) : undefined,
                operatorId,
                categoryId: updateDto.categoryId,
                subCategoryId: updateDto.subCategoryId,
                source: updateDto.source,
                letterNumber: updateDto.letterNumber,
                attachmentPath: updateDto.attachmentPath,
                grandTotal: new library_1.Decimal(grandTotal.toFixed(2)),
                items: updateDto.items
                    ? {
                        create: updateDto.items.map((item) => ({
                            itemCode: item.itemCode,
                            itemName: item.itemName,
                            price: new library_1.Decimal(item.price.toFixed(2)),
                            quantity: item.quantity,
                            unit: item.unit,
                            totalPrice: new library_1.Decimal((item.price * item.quantity).toFixed(2)),
                            expiredDate: item.expiredDate ? new Date(item.expiredDate) : null,
                        })),
                    }
                    : undefined,
            },
            include: {
                operator: { select: { id: true, username: true, nama: true } },
                category: true,
                subCategory: true,
                items: true,
            },
        });
    }
    async toggleVerified(id, toggleDto, userId, userRole) {
        const existing = await this.findOne(id, userId, userRole);
        if (userRole === 'Operator' && existing.operatorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.incomingGood.update({
            where: { id },
            data: { isVerified: toggleDto.isVerified },
            include: {
                operator: { select: { id: true, username: true, nama: true } },
                category: true,
                subCategory: true,
                items: true,
            },
        });
    }
    async remove(id, userId, userRole) {
        const existing = await this.findOne(id, userId, userRole);
        if (userRole === 'Operator' && existing.operatorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.incomingGood.delete({ where: { id } });
    }
    async exportExcel(query, userId, userRole) {
        const { data } = await this.findAll({ ...query, page: 1, limit: 10000 }, userId, userRole);
        return data;
    }
    calculateGrandTotal(items) {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
};
exports.IncomingGoodsService = IncomingGoodsService;
exports.IncomingGoodsService = IncomingGoodsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IncomingGoodsService);
//# sourceMappingURL=incoming-goods.service.js.map