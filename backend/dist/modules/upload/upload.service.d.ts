import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private configService;
    private readonly uploadPath;
    constructor(configService: ConfigService);
    getMulterConfig(): {
        storage: import("multer").StorageEngine;
        fileFilter: (req: any, file: any, cb: any) => void;
        limits: {
            fileSize: number;
        };
    };
    getFileUrl(filename: string): string;
    deleteFile(filename: string): boolean;
}
