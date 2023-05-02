import { Injectable } from '@nestjs/common';
import { MongooseOptionsFactory } from '@nestjs/mongoose';
import { MongooseModuleOptions } from '@nestjs/mongoose/dist';

@Injectable()
export class ConfigService implements MongooseOptionsFactory {
  async createMongooseOptions(): Promise<MongooseModuleOptions> {
    return {
      uri: 'mongodb://localhost:C2y6yDjf5%2FR%2Bob0N8A7Cgv30VRDJIWEHLM%2B4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw%2FJw%3D%3D@localhost:10255/admin?tls=true&tlsInsecure=true&directConnection=true&retrywrites=false',
    };
  }
}
