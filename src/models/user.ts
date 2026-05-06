import { randomUUID } from 'node:crypto'

export interface UserDBO {
  id: string
  name: string
  email: string
  password_hash: string
  role: 'ADMIN' | 'COMMON'
}

export class User {
  readonly id: string

  name: string

  email: string

  private passwordHash: string

  role: 'ADMIN' | 'COMMON'

  constructor(data: Optional<UserDBO, 'id' | 'role'>) {
    this.id = data.id ?? randomUUID()
    this.role = data.role ?? 'COMMON'

    this.name = data.name
    this.email = data.email
    this.passwordHash = data.password_hash
  }

  getPasswordHash() {
    return this.passwordHash
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
    }
  }
}