import { Op } from 'sequelize'

import { User } from '@/database/sequelize/user'

export class UsersRepository {
  static instance: UsersRepository

  constructor() {
    if(UsersRepository.instance) {
      return UsersRepository.instance
    }

    UsersRepository.instance = this
  }

  async create(data: User): Promise<void> {
    await User.create(data)
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ 
      where: { 
        email, 
      }, 
    })
  }

  async findById(id: number): Promise<User | null> {
    return User.findByPk(id)
  }

  async findMany(after?: number, limit = 10): Promise<User[]> {
    const users = await User.findAll({ where: { id: { [Op.gt]: after ?? 0 } }, order: [['id', 'ASC']], limit })

    return users
  }
}