import { User } from '@/database/sequelize/user'

export {}

declare global {
  type Optional<O, K extends keyof O = keyof O> = Omit<O, K> & Partial<Pick<O, K>>
  type SuperOmit<T, K extends keyof T> = Omit<T, K>

  namespace Express {
    interface Request {
      getUser(): User | null
      isAuthenticated(): boolean
    }
  }
}