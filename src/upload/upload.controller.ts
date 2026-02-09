import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class UploadImageDto {
    image!: string; // base64 string
    folder?: string;
}

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post('image')
    async uploadImage(@Body() uploadDto: UploadImageDto) {
        const url = await this.uploadService.uploadImage(
            uploadDto.image,
            uploadDto.folder || 'vangestor/students',
        );
        return { url };
    }
}
