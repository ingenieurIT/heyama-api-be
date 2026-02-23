import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectEntity } from './schemas/object.schema';
import { CreateObjectDto } from './dto/create-object.dto';
import { ObjectResponseDto } from './dto/object-response.dto';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectModel(ObjectEntity.name)
    private objectModel: Model<ObjectEntity>,
    private storageService: StorageService,
  ) {}

  async create(
    createObjectDto: CreateObjectDto,
    file: Express.Multer.File,
  ): Promise<ObjectResponseDto> {
    // Upload image to MinIO
    const imageUrl = await this.storageService.uploadFile(file, 'objects');

    // Create object in MongoDB
    const createdObject = new this.objectModel({
      ...createObjectDto,
      imageUrl,
    });

    const savedObject = await createdObject.save();

    return this.mapToResponseDto(savedObject);
  }

  async findAll(): Promise<ObjectResponseDto[]> {
    const objects = await this.objectModel.find().sort({ createdAt: -1 }).exec();
    return objects.map((obj) => this.mapToResponseDto(obj));
  }

  async findOne(id: string): Promise<ObjectResponseDto> {
    const object = await this.objectModel.findById(id).exec();
    if (!object) {
      throw new Error('Object not found');
    }
    return this.mapToResponseDto(object);
  }

  async delete(id: string): Promise<void> {
    const object = await this.objectModel.findById(id).exec();
    if (!object) {
      throw new Error('Object not found');
    }

    // Delete image from MinIO
    await this.storageService.deleteFile(object.imageUrl);

    // Delete object from MongoDB
    await this.objectModel.findByIdAndDelete(id).exec();
  }

  private mapToResponseDto(object: any): ObjectResponseDto {
    return {
      id: object._id.toString(),
      title: object.title,
      description: object.description,
      imageUrl: object.imageUrl,
      createdAt: object.createdAt,
    };
  }
}
