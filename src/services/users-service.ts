import { Op } from 'sequelize'

import { User } from '@/database/sequelize/user'

export class UsersService {
  async findAll({ omit = [] }: { omit?: number[] } = {}) {
    const users = await User.findAll({
      where: {
        id: {
          [Op.notIn]: omit,
        },
      },
    })

    return users
  }
}