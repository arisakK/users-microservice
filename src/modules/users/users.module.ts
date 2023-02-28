import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'

import { UsersMicroservice } from './users.microservice'
import { UsersService } from './users.service'

import { DB_CONNECTION_NAME } from '../../constants'
import { models } from '../../mongoose.providers'

@Module({
  imports: [MongooseModule.forFeature(models, DB_CONNECTION_NAME)],
  controllers: [UsersMicroservice],
  providers: [UsersService, JwtService],
  exports: [UsersService],
})
export class UsersModule {}
