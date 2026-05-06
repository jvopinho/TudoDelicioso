import { randomUUID } from 'node:crypto'

import { createEnum, enumInfer } from '@/utils/create-enum'

export const UserRole = createEnum([
  'ADMIN',
  'STUDENT',
] as const)
export type UserRole = enumInfer<typeof UserRole>

export interface UserDBO {
  id: string
  name: string
  email: string
  password_hash: string
  role: UserRole
}

export class User {
  readonly id: string

  name: string

  email: string

  private passwordHash: string

  role: UserRole

  constructor(data: Optional<UserDBO, 'id' | 'role'>) {
    this.id = data.id ?? randomUUID()
    this.role = data.role ?? UserRole.STUDENT

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