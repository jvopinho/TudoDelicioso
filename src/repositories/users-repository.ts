import { PasswordAdapter } from '@/adapters/password-adapter'
import { User } from '@/models/user'

const hashedPassword = await PasswordAdapter.hashPassword('1234')

export class UsersRepository {
  private data: User[] = [
    new User({ id: '1', name: 'John Doe', email: 'johndoe@email.com', password_hash: hashedPassword, role: 'ADMIN' }),
  ]

  static instance: UsersRepository

  constructor() {
    if(UsersRepository.instance) {
      return UsersRepository.instance
    }

    UsersRepository.instance = this
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.data.find(user => user.email === email) ?? null
  }

  async findById(id: string): Promise<User | null> {
    return this.data.find(user => user.id === id) ?? null
  }
}