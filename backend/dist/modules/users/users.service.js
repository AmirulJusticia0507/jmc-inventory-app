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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: createUserDto.username },
                    { email: createUserDto.email },
                ],
            },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Username or email already exists');
        }
        this.validatePassword(createUserDto.password);
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        return this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
            },
            select: {
                id: true,
                username: true,
                nama: true,
                email: true,
                role: true,
                isLocked: true,
                createdAt: true,
            },
        });
    }
    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                username: true,
                nama: true,
                email: true,
                role: true,
                isLocked: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                nama: true,
                email: true,
                role: true,
                isLocked: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async update(id, updateUserDto) {
        await this.findOne(id);
        if (updateUserDto.email) {
            const existingEmail = await this.prisma.user.findFirst({
                where: { email: updateUserDto.email, NOT: { id } },
            });
            if (existingEmail) {
                throw new common_1.ConflictException('Email already exists');
            }
        }
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
            select: {
                id: true,
                username: true,
                nama: true,
                email: true,
                role: true,
                isLocked: true,
                createdAt: true,
            },
        });
    }
    async toggleLock(id) {
        const user = await this.findOne(id);
        return this.prisma.user.update({
            where: { id },
            data: { isLocked: !user.isLocked },
            select: {
                id: true,
                username: true,
                nama: true,
                email: true,
                role: true,
                isLocked: true,
            },
        });
    }
    async changePassword(id, changePasswordDto) {
        await this.findOne(id);
        this.validatePassword(changePasswordDto.newPassword);
        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        return this.prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
            select: { id: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.user.delete({ where: { id } });
    }
    validatePassword(password) {
        if (password.length < 8 || password.length > 100) {
            throw new common_1.BadRequestException('Password must be 8-100 characters');
        }
        if (!/[A-Z]/.test(password)) {
            throw new common_1.BadRequestException('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            throw new common_1.BadRequestException('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            throw new common_1.BadRequestException('Password must contain at least one number');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map