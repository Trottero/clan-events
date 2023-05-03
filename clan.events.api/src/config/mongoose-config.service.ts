import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseOptionsFactory } from '@nestjs/mongoose';
import { MongooseModuleOptions } from '@nestjs/mongoose/dist';
import { AppConfig } from './config';
import { DatabaseConfig } from 'src/database/database.config';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private config: ConfigService<AppConfig>) {}

  async createMongooseOptions(): Promise<MongooseModuleOptions> {
    return {
      uri: this.config.get<DatabaseConfig>('database').uri,
      sslKey: this.config.get<DatabaseConfig>('database').key,
      sslCert: this.config.get<DatabaseConfig>('database').key,
    };
  }
}
