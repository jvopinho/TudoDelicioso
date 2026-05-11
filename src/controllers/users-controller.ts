import { AppResponse, AuthenticatedRequest } from '@/@types/express'
import { PasswordAdapter } from '@/adapters/password-adapter'
import { User } from '@/database/sequelize/user'
import { AuthMiddleware } from '@/http/middlewares/auth-middleware'
import { BodyMiddleware } from '@/http/middlewares/body-middleware'
import { UsersRepository } from '@/repositories'
import { CreateUserDTO } from '@/schemas/user-dto'

export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @AuthMiddleware({ onlyAuthenticated: true, onlyAdmin: true })
  @BodyMiddleware(CreateUserDTO)
  async createUser(req: AuthenticatedRequest, res: AppResponse) {
    const { email, name, password } = req.body as CreateUserDTO

    const passwordHash = await PasswordAdapter.hashPassword(password)
    
    const user = new User({
      email,
      name,
      passwordHash,
    })

    await this.usersRepository.create(user)

    res.json(user.toJSON())
  }

  @AuthMiddleware({ onlyAuthenticated: true })
  getCurrentUser(req: AuthenticatedRequest, res: AppResponse) {
    const user = req.getUser()

    res.json(user.toJSON())
  }

  @AuthMiddleware({ onlyAuthenticated: true, onlyAdmin: true })
  async getAllUsers(req: AuthenticatedRequest, res: AppResponse) {
    const params = req.query as { after?: string, limit?: string }
    
    const users = await this.usersRepository.findMany(params.after ? Number(params.after) : undefined, params.limit ? Number(params.limit) : undefined)

    res.json(users.map(user => user.toJSON()))
  }
}