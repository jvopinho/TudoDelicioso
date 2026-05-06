import { AppResponse, AuthenticatedRequest } from '@/@types/express'
import { PasswordAdapter } from '@/adapters/password-adapter'
import { AuthMiddleware } from '@/http/middlewares/auth-middleware'
import { BodyMiddleware } from '@/http/middlewares/body-middleware'
import { User } from '@/models/user'
import { UsersRepository } from '@/repositories'
import { CreateUserDTO } from '@/schemas/create-user-schema'

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
      password_hash: passwordHash,
    })

    await this.usersRepository.create(user)

    res.json(user.toJSON())
  }

  @AuthMiddleware({ onlyAuthenticated: true })
  getCurrentUser(req: AuthenticatedRequest, res: AppResponse) {
    const user = req.getUser()

    res.json({ user })
  }
}