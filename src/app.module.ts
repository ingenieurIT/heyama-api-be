import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectsModule } from './objects/objects.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/heyama',
    ),
    ObjectsModule,
    StorageModule,
  ],
})
export class AppModule {}
