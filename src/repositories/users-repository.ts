import { PasswordAdapter } from '@/adapters/password-adapter'
import { User } from '@/models/user'

const hashedPassword = await PasswordAdapter.hashPassword('123456')

export class UsersRepository {
  private data: User[] = [
    new User({ id: 1, name: 'John Doe', email: 'johndoe@email.com', password_hash: hashedPassword, role: 'ADMIN' }),
    ...Array.from({ length: 20 }, (_, i) => new User({ id: i + 2, name: `User ${i + 2}`, email: `user${i + 2}@email.com`, password_hash: hashedPassword, role: 'STUDENT' })),
  ]

  static instance: UsersRepository

  constructor() {
    if(UsersRepository.instance) {
      return UsersRepository.instance
    }

    UsersRepository.instance = this
  }

  async create(data: User): Promise<void> {
    this.data.push(data)
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.data.find(user => user.email === email) ?? null
  }

  async findById(id: number): Promise<User | null> {
    return this.data.find(user => user.id === id) ?? null
  }

  async findMany(after?: number, limit = 10): Promise<User[]> {
    const sortedData = this.data.sort((a, b) => a.id - b.id)

    if(!after) {
      return sortedData.slice(0, limit)
    }

    const afterIndex = sortedData.findIndex(user => user.id === after)

    if(afterIndex === -1) {
      return sortedData.slice(0, limit)
    }

    return sortedData.slice(afterIndex + 1, afterIndex + 1 + limit)
  }
}