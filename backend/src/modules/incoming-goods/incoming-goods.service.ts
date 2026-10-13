import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIncomingGoodDto, UpdateIncomingGoodDto, IncomingGoodQueryDto, ToggleVerifiedDto, IncomingGoodItemDto } from './dto';
import { Role } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class IncomingGoodsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateIncomingGoodDto, userId: string, userRole: Role) {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id: createDto.subCategoryId },
    });

    if (!subCategory) {
      throw new NotFoundException('Sub-category not found');
    }

    if (createDto.categoryId !== subCategory.categoryId) {
      throw new BadRequestException('Sub-category does not belong to the selected category');
    }

    const grandTotal = this.calculateGrandTotal(createDto.items);
    
    if (grandTotal > Number(subCategory.priceLimit)) {
      throw new BadRequestException(
        `Total harga barang (${grandTotal}) melebihi batas harga sub kategori (${subCategory.priceLimit})`
      );
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
        grandTotal: new Decimal(grandTotal.toFixed(2)),
        items: {
          create: createDto.items.map((item: IncomingGoodItemDto) => ({
            itemCode: item.itemCode,
            itemName: item.itemName,
            price: new Decimal(item.price.toFixed(2)),
            quantity: item.quantity,
            unit: item.unit,
            totalPrice: new Decimal((item.price * item.quantity).toFixed(2)),
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

  async findAll(query: IncomingGoodQueryDto, userId: string, userRole: Role) {
    const { page = 1, limit = 10, categoryId, subCategoryId, year, search, sortBy = 'transactionDate', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (userRole === 'Operator') {
      where.operatorId = userId;
    }

    if (categoryId) where.categoryId = categoryId;
    if (subCategoryId) where.subCategoryId = subCategoryId;
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

  async findOne(id: string, userId: string, userRole: Role) {
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
      throw new NotFoundException('Incoming good not found');
    }

    if (userRole === 'Operator' && incomingGood.operatorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return incomingGood;
  }

  async update(id: string, updateDto: UpdateIncomingGoodDto, userId: string, userRole: Role) {
    const existing = await this.findOne(id, userId, userRole);

    if (userRole === 'Operator' && existing.operatorId !== userId) {
      throw new ForbiddenException('Access denied');
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
        throw new BadRequestException(
          `Total harga barang (${grandTotal}) melebihi batas harga sub kategori (${subCategory.priceLimit})`
        );
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
        grandTotal: new Decimal(grandTotal.toFixed(2)),
        items: updateDto.items
          ? {
              create: updateDto.items.map((item: IncomingGoodItemDto) => ({
                itemCode: item.itemCode,
                itemName: item.itemName,
                price: new Decimal(item.price.toFixed(2)),
                quantity: item.quantity,
                unit: item.unit,
                totalPrice: new Decimal((item.price * item.quantity).toFixed(2)),
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

  async toggleVerified(id: string, toggleDto: ToggleVerifiedDto, userId: string, userRole: Role) {
    const existing = await this.findOne(id, userId, userRole);

    if (userRole === 'Operator' && existing.operatorId !== userId) {
      throw new ForbiddenException('Access denied');
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

  async remove(id: string, userId: string, userRole: Role) {
    const existing = await this.findOne(id, userId, userRole);

    if (userRole === 'Operator' && existing.operatorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.incomingGood.delete({ where: { id } });
  }

  async exportExcel(query: IncomingGoodQueryDto, userId: string, userRole: Role) {
    const { data } = await this.findAll({ ...query, page: 1, limit: 10000 }, userId, userRole);
    return data;
  }

  private calculateGrandTotal(items: IncomingGoodItemDto[]): number {
    return items.reduce((sum: number, item: IncomingGoodItemDto) => sum + item.price * item.quantity, 0);
  }
}