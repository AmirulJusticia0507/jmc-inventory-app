import { UploadService } from './upload.service';
export declare class UploadController {
    private uploadService;
    constructor(uploadService: UploadService);
    uploadFile(file: Express.Multer.File): Promise<{
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
    }>;
}
