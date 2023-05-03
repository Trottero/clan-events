import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseOptionsFactory } from '@nestjs/mongoose';
import { MongooseModuleOptions } from '@nestjs/mongoose/dist';
import { Configuration, DatabaseConfiguration } from './config';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private config: ConfigService<Configuration>) {}

  async createMongooseOptions(): Promise<MongooseModuleOptions> {
    return {
      uri: this.config.get<DatabaseConfiguration>('database').uri,
      sslKey: this.config.get<DatabaseConfiguration>('database').key,
      sslCert: this.config.get<DatabaseConfiguration>('database').key,
    };
  }
}
