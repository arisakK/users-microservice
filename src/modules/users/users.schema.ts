import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { nanoid } from 'nanoid'

import ERolesUsers from './enum/users-roles.enum'
import UsersStatusEnum from './enum/users-status.enum'

export type UsersDocument = HydratedDocument<Users>

@Schema({ collection: 'users', timestamps: true, versionKey: false })
export class Users {
  @Prop({
    type: String,
    index: true,
    unique: true,
    default: () => nanoid(10),
  })
  objectId?: string

  @Prop({
    type: String,
    index: true,
    unique: true,
    required: true,
  })
  username: string

  @Prop({
    type: String,
    index: true,
    required: true,
  })
  email: string

  @Prop({
    type: String,
    index: true,
    required: true,
  })
  mobile: string

  @Prop({
    type: String,
    index: true,
    required: true,
  })
  password: string

  @Prop({
    type: String,
    index: true,
    required: true,
  })
  displayName: string

  @Prop({
    type: String,
    index: true,
    required: true,
  })
  firstName: string

  @Prop({
    type: String,
    index: true,
    required: true,
  })
  lastName: string

  @Prop({
    enum: UsersStatusEnum,
    index: true,
    default: UsersStatusEnum.ACTIVE,
  })
  status?: string

  @Prop({
    type: String,
    default: null,
  })
  token?: string

  @Prop({
    type: Date,
    default: null,
  })
  latestLogin?: Date

  @Prop({
    type: String,
    default: null,
  })
  refreshToken?: string

  @Prop({
    type: String,
    default: null,
  })
  twoFactorSecret?: string

  @Prop({
    type: String,
    default: null,
  })
  isTwoFactorEnabled?: boolean

  @Prop({
    enum: ERolesUsers,
    default: ERolesUsers.USER,
  })
  roles?: ERolesUsers

  @Prop({
    type: [String],
    default: ['buy', 'get'],
  })
  permissions?: string[]
}

export const UsersSchema = SchemaFactory.createForClass(Users)
