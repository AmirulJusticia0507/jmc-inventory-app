import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from '@/common';
import { SubCategoriesService } from './sub-categories.service';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './dto';

@ApiTags('Sub-Categories')
@Controller('sub-categories')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class SubCategoriesController {
  constructor(private subCategoriesService: SubCategoriesService) {}

  @Post()
  @Roles('Admin')
  @ApiOperation({ summary: 'Create sub-category (Admin only)' })
  create(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.subCategoriesService.create(createSubCategoryDto);
  }

  @Get()
  @Roles('Admin', 'Operator')
  @ApiOperation({ summary: 'Get all sub-categories' })
  findAll() {
    return this.subCategoriesService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'Operator')
  @ApiOperation({ summary: 'Get sub-category by ID' })
  findOne(@Param('id') id: string) {
    return this.subCategoriesService.findOne(id);
  }

  @Patch(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update sub-category (Admin only)' })
  update(@Param('id') id: string, @Body() updateSubCategoryDto: UpdateSubCategoryDto) {
    return this.subCategoriesService.update(id, updateSubCategoryDto);
  }

  @Delete(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete sub-category (Admin only)' })
  remove(@Param('id') id: string) {
    return this.subCategoriesService.remove(id);
  }
}