import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/database/schemas/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';

const MongooseDbConfig = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

@Module({
  imports: [MongooseDbConfig],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseDbConfig],
})
export class UserModule {}
