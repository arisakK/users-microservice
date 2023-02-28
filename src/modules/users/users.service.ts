import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, SortOrder, UpdateWriteOpResult } from 'mongoose'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'

import { Users, UsersDocument } from './users.schema'

import { DB_CONNECTION_NAME } from '../../constants'

@Injectable()
export class UsersService {
  @InjectModel(Users.name, DB_CONNECTION_NAME)
  private readonly userModel: Model<UsersDocument>

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  getModel(): Model<UsersDocument> {
    return this.userModel
  }

  async createTokens(objectId: string, username: string): Promise<any> {
    const jwtOption: JwtSignOptions = {
      secret: this.configService.get<string>('authentication.secret'),
    }
    return Promise.all([
      this.jwtService.signAsync(
        {
          objectId,
          username,
        },
        jwtOption,
      ),
      this.jwtService.signAsync(
        {
          objectId,
          username,
        },
        jwtOption,
      ),
    ])
  }

  async getPagination(
    conditions: FilterQuery<UsersDocument>,
    pagination?: { page: number; perPage: number },
    sort: { [key: string]: SortOrder } | string = { _id: 1 },
    select = {},
  ): Promise<[Users[], number]> {
    const { page = 1, perPage = 20 } = pagination

    return Promise.all([
      this.userModel
        .find(conditions)
        .select(select)
        .sort(sort)
        .skip((page - 1) * +perPage)
        .limit(+perPage)
        .lean(),
      this.userModel.countDocuments(conditions),
    ])
  }

  async getByObjectId(objectId: string): Promise<Users> {
    return this.userModel
      .findOne(
        { objectId },
        {
          _id: 0,
          objectId: 1,
          username: 1,
          email: 1,
          mobile: 1,
          refAf: 1,
          roles: 1,
          permissions: 1,
          isTwoFactorEnabled: 1,
        },
      )
      .lean()
  }

  async getByUsername(username: string): Promise<Users> {
    return this.userModel
      .findOne({ username }, { _id: 0, createdAt: 0, updatedAt: 0 })
      .lean()
  }

  async setTwoFactor(
    objectId: string,
    twoFactorSecret: string,
  ): Promise<UpdateWriteOpResult> {
    return this.userModel.updateOne({ objectId }, { twoFactorSecret })
  }
}
