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
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const uuid_1 = require("uuid");
let UploadService = class UploadService {
    constructor(configService) {
        this.configService = configService;
        this.uploadPath = this.configService.get('UPLOAD_PATH') || (0, path_1.join)(process.cwd(), 'uploads');
        if (!(0, fs_1.existsSync)(this.uploadPath)) {
            (0, fs_1.mkdirSync)(this.uploadPath, { recursive: true });
        }
    }
    getMulterConfig() {
        return {
            storage: (0, multer_1.diskStorage)({
                destination: (req, file, cb) => {
                    cb(null, this.uploadPath);
                },
                filename: (req, file, cb) => {
                    const uniqueName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
                    cb(null, uniqueName);
                },
            }),
            fileFilter: (req, file, cb) => {
                const allowedMimes = [
                    'application/pdf',
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ];
                if (allowedMimes.includes(file.mimetype)) {
                    cb(null, true);
                }
                else {
                    cb(null, false);
                }
            },
            limits: {
                fileSize: 10 * 1024 * 1024,
            },
        };
    }
    getFileUrl(filename) {
        const baseUrl = this.configService.get('APP_URL') || 'http://localhost:3000';
        return `${baseUrl}/uploads/${filename}`;
    }
    deleteFile(filename) {
        const filePath = (0, path_1.join)(this.uploadPath, filename);
        if ((0, fs_1.existsSync)(filePath)) {
            require('fs').unlinkSync(filePath);
            return true;
        }
        return false;
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
//# sourceMappingURL=upload.service.js.map