import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ThrottlerModule } from '@nestjs/throttler'

import { UsersModule } from '../users/users.module'

import configuration from '../../config/configuration'
import { mongooseModuleAsyncOptions } from '../../mongoose.providers'
import {
  throttlerAsyncOptions,
  throttlerServiceProvider,
} from '../../throttler.providers'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
    ThrottlerModule.forRootAsync(throttlerAsyncOptions),
    UsersModule,
  ],
  providers: [throttlerServiceProvider],
})
export class AppModule {}
