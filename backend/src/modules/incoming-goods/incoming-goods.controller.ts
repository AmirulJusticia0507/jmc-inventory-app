import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard, CurrentUser } from '@/common';
import { IncomingGoodsService } from './incoming-goods.service';
import { CreateIncomingGoodDto, UpdateIncomingGoodDto, IncomingGoodQueryDto, ToggleVerifiedDto } from './dto';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';

@ApiTags('Incoming Goods')
@Controller('incoming-goods')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class IncomingGoodsController {
  constructor(private incomingGoodsService: IncomingGoodsService) {}

  @Post()
  @Roles('Admin', 'Operator')
  @ApiOperation({ summary: 'Create incoming goods transaction' })
  create(
    @Body() createDto: CreateIncomingGoodDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.incomingGoodsService.create(createDto, user.id, user.role as any);
  }

  @Get()
  @Roles('Admin', 'Operator')
  @ApiOperation({ summary: 'Get all incoming goods with pagination, filter, search, sort' })
  findAll(
    @Query() query: IncomingGoodQueryDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.incomingGoodsService.findAll(query, user.id, user.role as any);
  }

  @Get('export')
  @Roles('Admin', 'Operator')
  @ApiOperation({ summary: 'Export incoming goods to Excel' })
  async exportExcel(
    @Query() query: IncomingGoodQueryDto,
    @CurrentUser() user: { id: string; role: string },
    @Res() res: Response,
  ) {
    const data = await this.incomingGoodsService.exportExcel(query, user.id, user.role as any);
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Barang Masuk');
    
    worksheet.columns = [
      { header: 'Tanggal', key: 'transactionDate', width: 20 },
      { header: 'Operator', key: 'operator', width: 20 },
      { header: 'Kategori', key: 'category', width: 20 },
      { header: 'Sub Kategori', key: 'subCategory', width: 20 },
      { header: 'Asal', key: 'source', width: 30 },
      { header: 'No Surat', key: 'letterNumber', width: 20 },
      { header: 'Total', key: 'grandTotal', width: 20 },
      { header: 'Verified', key: 'isVerified', width: 15 },
    ];

    data.forEach((item: any) => {
      worksheet.addRow({
        transactionDate: item.transactionDate,
        operator: item.operator?.nama,
        category: item.category?.name,
        subCategory: item.subCategory?.name,
        source: item.source,
        letterNumber: item.letterNumber || '',
        grandTotal: item.grandTotal,
        isVerified: item.isVerified ? 'Ya' : 'Tidak',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=barang-masuk.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  }

  @Get(':id')
  @Roles('Admin', 'Operator')
  @ApiOperation({ summary: 'Get incoming goods by ID' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.incomingGoodsService.findOne(id, user.id, user.role as any);
  }

  @Patch(':id')
  @Roles('Admin', 'Operator')
  @ApiOperation({ summary: 'Update incoming goods transaction' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateIncomingGoodDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.incomingGoodsService.update(id, updateDto, user.id, user.role as any);
  }

  @Patch(':id/verify')
  @Roles('Admin', 'Operator')
  @ApiOperation({ summary: 'Toggle verification status' })
  toggleVerified(
    @Param('id') id: string,
    @Body() toggleDto: ToggleVerifiedDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.incomingGoodsService.toggleVerified(id, toggleDto, user.id, user.role as any);
  }

  @Delete(':id')
  @Roles('Admin', 'Operator')
  @ApiOperation({ summary: 'Delete incoming goods transaction' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.incomingGoodsService.remove(id, user.id, user.role as any);
  }
}