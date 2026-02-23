import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService implements OnModuleInit {
  private minioClient: Minio.Client;
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    this.bucketName = process.env.MINIO_BUCKET_NAME || 'heyama-objects';
    this.publicUrl = process.env.MINIO_PUBLIC_URL || 'http://localhost:9000';

    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT) || 9000,
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
    await this.setBucketPublicPolicy();
  }

  private async ensureBucketExists() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        console.log(`Bucket ${this.bucketName} created successfully`);
      } else {
        console.log(`Bucket ${this.bucketName} already exists`);
      }
    } catch (error) {
      console.error('Error ensuring bucket exists:', error);
      throw error;
    }
  }

  private async setBucketPublicPolicy() {
    try {
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      };

      await this.minioClient.setBucketPolicy(
        this.bucketName,
        JSON.stringify(policy),
      );
      console.log(`Bucket ${this.bucketName} is now public`);
    } catch (error) {
      console.error('Error setting bucket policy:', error);
      throw error;
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'objects',
  ): Promise<string> {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

      const metaData = {
        'Content-Type': file.mimetype,
      };

      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        file.buffer,
        file.size,
        metaData,
      );

      // Return public URL
      const publicUrl = `${this.publicUrl}/${this.bucketName}/${fileName}`;
      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(imageUrl: string): Promise<void> {
    try {
      // Extract filename from URL
      const urlParts = imageUrl.split(`${this.bucketName}/`);
      if (urlParts.length < 2) {
        throw new Error('Invalid image URL');
      }
      const fileName = urlParts[1];

      await this.minioClient.removeObject(this.bucketName, fileName);
      console.log(`File ${fileName} deleted successfully`);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  getPublicUrl(fileName: string): string {
    return `${this.publicUrl}/${this.bucketName}/${fileName}`;
  }
}
