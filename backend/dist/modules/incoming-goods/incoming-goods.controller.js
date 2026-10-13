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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomingGoodsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const common_2 = require("../../common");
const incoming_goods_service_1 = require("./incoming-goods.service");
const dto_1 = require("./dto");
const ExcelJS = require("exceljs");
let IncomingGoodsController = class IncomingGoodsController {
    constructor(incomingGoodsService) {
        this.incomingGoodsService = incomingGoodsService;
    }
    create(createDto, user) {
        return this.incomingGoodsService.create(createDto, user.id, user.role);
    }
    findAll(query, user) {
        return this.incomingGoodsService.findAll(query, user.id, user.role);
    }
    async exportExcel(query, user, res) {
        const data = await this.incomingGoodsService.exportExcel(query, user.id, user.role);
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
        data.forEach((item) => {
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
    findOne(id, user) {
        return this.incomingGoodsService.findOne(id, user.id, user.role);
    }
    update(id, updateDto, user) {
        return this.incomingGoodsService.update(id, updateDto, user.id, user.role);
    }
    toggleVerified(id, toggleDto, user) {
        return this.incomingGoodsService.toggleVerified(id, toggleDto, user.id, user.role);
    }
    remove(id, user) {
        return this.incomingGoodsService.remove(id, user.id, user.role);
    }
};
exports.IncomingGoodsController = IncomingGoodsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_2.Roles)('Admin', 'Operator'),
    (0, swagger_1.ApiOperation)({ summary: 'Create incoming goods transaction' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateIncomingGoodDto, Object]),
    __metadata("design:returntype", void 0)
], IncomingGoodsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_2.Roles)('Admin', 'Operator'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all incoming goods with pagination, filter, search, sort' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.IncomingGoodQueryDto, Object]),
    __metadata("design:returntype", void 0)
], IncomingGoodsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, common_2.Roles)('Admin', 'Operator'),
    (0, swagger_1.ApiOperation)({ summary: 'Export incoming goods to Excel' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_2.CurrentUser)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.IncomingGoodQueryDto, Object, Object]),
    __metadata("design:returntype", Promise)
], IncomingGoodsController.prototype, "exportExcel", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_2.Roles)('Admin', 'Operator'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incoming goods by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IncomingGoodsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_2.Roles)('Admin', 'Operator'),
    (0, swagger_1.ApiOperation)({ summary: 'Update incoming goods transaction' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateIncomingGoodDto, Object]),
    __metadata("design:returntype", void 0)
], IncomingGoodsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/verify'),
    (0, common_2.Roles)('Admin', 'Operator'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle verification status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ToggleVerifiedDto, Object]),
    __metadata("design:returntype", void 0)
], IncomingGoodsController.prototype, "toggleVerified", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_2.Roles)('Admin', 'Operator'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete incoming goods transaction' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IncomingGoodsController.prototype, "remove", null);
exports.IncomingGoodsController = IncomingGoodsController = __decorate([
    (0, swagger_1.ApiTags)('Incoming Goods'),
    (0, common_1.Controller)('incoming-goods'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), common_2.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [incoming_goods_service_1.IncomingGoodsService])
], IncomingGoodsController);
//# sourceMappingURL=incoming-goods.controller.js.map