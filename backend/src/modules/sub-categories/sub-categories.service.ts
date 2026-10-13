import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './dto';

@Injectable()
export class SubCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: createSubCategoryDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.subCategory.create({
      data: createSubCategoryDto,
      include: { category: true },
    });
  }

  async findAll() {
    return this.prisma.subCategory.findMany({
      include: {
        category: true,
        _count: { select: { incomingGoods: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id },
      include: {
        category: true,
        _count: { select: { incomingGoods: true } },
      },
    });

    if (!subCategory) {
      throw new NotFoundException('Sub-category not found');
    }

    return subCategory;
  }

  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    await this.findOne(id);

    if (updateSubCategoryDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateSubCategoryDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    return this.prisma.subCategory.update({
      where: { id },
      data: updateSubCategoryDto,
      include: { category: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.subCategory.delete({ where: { id } });
  }
}