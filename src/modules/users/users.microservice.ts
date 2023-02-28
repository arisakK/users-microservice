import { Controller, InternalServerErrorException } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

import UsersStatusEnum from './enum/users-status.enum'
import { LoginInterface } from './interface/login.interface'
import { PayloadUsersCreateInterface } from './interface/payload-users-create.interface'
import { PayloadUsersUpdateInterface } from './interface/payload-users-update.interface'
import { Users, UsersDocument } from './users.schema'
import { UsersService } from './users.service'

import { LoggerService } from '../logger/logger.service'

import { FindOptionsInterface } from '../../interfaces/find-options.interface'
import {
  PaginationInterface,
  PaginationResponseInterface,
} from '../../interfaces/pagination.interface'
import { USERS } from '../../microservice.constants'

@Controller('users')
export class UsersMicroservice {
  private readonly logger: LoggerService = new LoggerService(
    UsersMicroservice.name,
  )

  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({
    cmd: USERS,
    method: 'sign-in',
  })
  async signIn(
    @Payload() payload: { objectId: string; username: string },
  ): Promise<LoginInterface> {
    const { objectId, username } = payload

    let jwtSign: LoginInterface
    try {
      jwtSign = await this.usersService.createTokens(objectId, username)
    } catch (e) {
      this.logger.error(
        `catch on login-createTokens: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }

    const update = {
      $set: {
        token: jwtSign[0],
        latestLogin: Date.now(),
      },
    }

    try {
      await this.usersService.getModel().updateOne({ username }, update)
    } catch (e) {
      this.logger.error(
        `catch on login-update: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
    return {
      accessToken: jwtSign[0],
      refreshToken: jwtSign[1],
    }
  }

  @MessagePattern({
    cmd: USERS,
    method: 'getByObjectId',
  })
  async getByObjectId(@Payload() objectId: string): Promise<Users> {
    try {
      return this.usersService.getByObjectId(objectId)
    } catch (e) {
      this.logger.error(
        `catch on getByObjectId: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: USERS,
    method: 'getByUsername',
  })
  async getByUsername(@Payload() username: string): Promise<Users> {
    try {
      return this.usersService.getByUsername(username)
    } catch (e) {
      this.logger.error(
        `catch on getByUsername: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: USERS,
    method: 'getPagination',
  })
  async getPagination(
    @Payload()
    payload: PaginationInterface & FindOptionsInterface<UsersDocument>,
  ): Promise<PaginationResponseInterface<Users>> {
    const { filter, page, perPage, select, sort } = payload

    try {
      const [records, count] = await this.usersService.getPagination(
        filter,
        {
          page,
          perPage,
        },
        sort,
        select,
      )
      return {
        page,
        perPage,
        count,
        records,
      }
    } catch (e) {
      this.logger.error(
        `catch on getPagination: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: USERS,
    method: 'create',
  })
  async createUser(
    @Payload() payload: PayloadUsersCreateInterface,
  ): Promise<void> {
    try {
      await this.usersService.getModel().create(payload)
    } catch (e) {
      this.logger.error(
        `catch on createUser: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: USERS,
    method: 'update',
  })
  async updateUsers(
    @Payload()
    payload: {
      objectId: string
      update: PayloadUsersUpdateInterface
    },
  ): Promise<void> {
    const { objectId, update } = payload
    try {
      await this.usersService.getModel().updateOne({ objectId }, { update })
    } catch (e) {
      this.logger.error(
        `catch on updateUsers: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: USERS,
    method: 'delete',
  })
  async deleteUser(@Payload() objectId: string): Promise<void> {
    try {
      await this.usersService.getModel().deleteOne({ objectId })
    } catch (e) {
      this.logger.error(
        `catch on deleteUser: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }
  @MessagePattern({
    cmd: USERS,
    method: 'change-password',
  })
  async changePassword(
    @Payload() payload: { objectId: string; hashPassword: string },
  ): Promise<void> {
    const { objectId, hashPassword } = payload
    try {
      await this.usersService
        .getModel()
        .updateOne({ objectId }, { password: hashPassword })
    } catch (e) {
      this.logger.error(
        `catch on changePassword: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: USERS,
    method: 'update-status',
  })
  async updateStatus(
    @Payload() payload: { objectId: string; status: UsersStatusEnum },
  ): Promise<void> {
    const { objectId, status } = payload
    try {
      await this.usersService.getModel().updateOne({ objectId }, { status })
    } catch (e) {
      this.logger.error(
        `catch on updateStatus: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: USERS,
    method: 'update-permissions',
  })
  async updatePermissions(
    @Payload() payload: { objectId: string; permissions: [] },
  ): Promise<void> {
    const { objectId, permissions } = payload
    try {
      await this.usersService
        .getModel()
        .updateOne({ objectId }, { permissions })
    } catch (e) {
      this.logger.error(
        `catch on updatePermissions: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: USERS,
    method: 'setTwoFactor',
  })
  async setTwoFactor() {}
}
