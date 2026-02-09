import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadImage(base64Image: string, folder: string = 'vangestor/students'): Promise<string> {
        try {
            const result = await cloudinary.uploader.upload(base64Image, {
                folder,
                resource_type: 'auto',
                transformation: [
                    { width: 500, height: 500, crop: 'limit' },
                    { quality: 'auto' },
                    { fetch_format: 'auto' },
                ],
            });

            return result.secure_url;
        } catch (error: any) {
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }

    async deleteImage(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error: any) {
            throw new Error(`Failed to delete image: ${error.message}`);
        }
    }
}
