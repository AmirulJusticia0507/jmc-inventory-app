import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly uploadPath: string;

  constructor(private configService: ConfigService) {
    this.uploadPath = this.configService.get('UPLOAD_PATH') || join(process.cwd(), 'uploads');
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  getMulterConfig() {
    return {
      storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
          cb(null, this.uploadPath);
        },
        filename: (req: any, file: any, cb: any) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req: any, file: any, cb: any) => {
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
        } else {
          cb(null, false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    };
  }

  getFileUrl(filename: string): string {
    const baseUrl = this.configService.get('APP_URL') || 'http://localhost:3000';
    return `${baseUrl}/uploads/${filename}`;
  }

  deleteFile(filename: string): boolean {
    const filePath = join(this.uploadPath, filename);
    if (existsSync(filePath)) {
      require('fs').unlinkSync(filePath);
      return true;
    }
    return false;
  }
}