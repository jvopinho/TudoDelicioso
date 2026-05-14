import { User } from '@/database/sequelize/user'

export class AdminService {
  async findAllUsers() {
    const users = await User.findAll({
      order: [['id', 'ASC']],
    })

    return users.map(user => user.toJSON())
  }

  async findAllSkills() {
    return [
      {
        id: 1,
        name: 'Confecção de bolos',
        slug: 'confeccao-de-bolos',
      },
      {
        id: 2,
        name: 'Tortas salgadas',
        slug: 'tortas-salgadas',
      },
      {
        id: 3,
        name: 'Drinks',
        slug: 'drinks',
      },
    ]
  }
}