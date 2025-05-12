import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
    private s3 = new S3Client({
        region: 'ru-central1',
        endpoint: 'https://storage.yandexcloud.net',
        credentials: {
            accessKeyId: process.env.YC_KEY!,
            secretAccessKey: process.env.YC_SECRET!,
        },
    });

    async upload(buffer: Buffer, originalName: string, mimeType: string): Promise<string> {
        const filename = `${Date.now()}-${randomUUID()}-${originalName}`;

        const command = new PutObjectCommand({
            Bucket: process.env.YC_BUCKET!,
            Key: filename,
            Body: buffer,
            ContentType: mimeType,
        });

        await this.s3.send(command);

        return `https://storage.yandexcloud.net/${process.env.YC_BUCKET}/${filename}`;
    }
}
