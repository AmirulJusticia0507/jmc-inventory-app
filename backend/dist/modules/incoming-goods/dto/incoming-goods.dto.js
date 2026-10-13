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
exports.ToggleVerifiedDto = exports.IncomingGoodQueryDto = exports.UpdateIncomingGoodDto = exports.CreateIncomingGoodDto = exports.IncomingGoodItemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class IncomingGoodItemDto {
}
exports.IncomingGoodItemDto = IncomingGoodItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ITEM001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", String)
], IncomingGoodItemDto.prototype, "itemCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Laptop ASUS ROG' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", String)
], IncomingGoodItemDto.prototype, "itemName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15000000 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], IncomingGoodItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], IncomingGoodItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Unit' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(40),
    __metadata("design:type", String)
], IncomingGoodItemDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-12-31' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], IncomingGoodItemDto.prototype, "expiredDate", void 0);
class CreateIncomingGoodDto {
}
exports.CreateIncomingGoodDto = CreateIncomingGoodDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T10:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateIncomingGoodDto.prototype, "transactionDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-category' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateIncomingGoodDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-sub-category' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateIncomingGoodDto.prototype, "subCategoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PT Supplier Jaya' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", String)
], CreateIncomingGoodDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'SM-001/2024' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", String)
], CreateIncomingGoodDto.prototype, "letterNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'attachments/file.pdf' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Max)(255),
    __metadata("design:type", String)
], CreateIncomingGoodDto.prototype, "attachmentPath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-of-operator' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateIncomingGoodDto.prototype, "operatorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [IncomingGoodItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => IncomingGoodItemDto),
    __metadata("design:type", Array)
], CreateIncomingGoodDto.prototype, "items", void 0);
class UpdateIncomingGoodDto {
}
exports.UpdateIncomingGoodDto = UpdateIncomingGoodDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024-01-15T10:00:00Z' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateIncomingGoodDto.prototype, "transactionDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-of-category' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateIncomingGoodDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-of-sub-category' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateIncomingGoodDto.prototype, "subCategoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'PT Supplier Jaya' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", String)
], UpdateIncomingGoodDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'SM-001/2024' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", String)
], UpdateIncomingGoodDto.prototype, "letterNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'attachments/file.pdf' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Max)(255),
    __metadata("design:type", String)
], UpdateIncomingGoodDto.prototype, "attachmentPath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-of-operator' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateIncomingGoodDto.prototype, "operatorId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [IncomingGoodItemDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => IncomingGoodItemDto),
    __metadata("design:type", Array)
], UpdateIncomingGoodDto.prototype, "items", void 0);
class IncomingGoodQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
        this.sortBy = 'transactionDate';
        this.sortOrder = 'desc';
    }
}
exports.IncomingGoodQueryDto = IncomingGoodQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], IncomingGoodQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], IncomingGoodQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-of-category' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], IncomingGoodQueryDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-of-sub-category' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], IncomingGoodQueryDto.prototype, "subCategoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2024 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IncomingGoodQueryDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'laptop' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IncomingGoodQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['transactionDate', 'source', 'grandTotal'], example: 'transactionDate' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IncomingGoodQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['asc', 'desc'], example: 'desc' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IncomingGoodQueryDto.prototype, "sortOrder", void 0);
class ToggleVerifiedDto {
}
exports.ToggleVerifiedDto = ToggleVerifiedDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ToggleVerifiedDto.prototype, "isVerified", void 0);
//# sourceMappingURL=incoming-goods.dto.js.map