import { AppResponse, AuthenticatedRequest } from '@/@types/express'
import { PasswordAdapter } from '@/adapters/password-adapter'
import { User } from '@/database/sequelize/user'
import { AuthMiddleware } from '@/http/middlewares/auth-middleware'
import { BodyMiddleware } from '@/http/middlewares/body-middleware'
import { UpdateUserDTO } from '@/schemas/user-dto'

export class AdminController {
  @AuthMiddleware({ onlyAuthenticated: true, onlyAdmin: true })
  @BodyMiddleware(UpdateUserDTO)
  async updateUser(req: AuthenticatedRequest, res: AppResponse) {
    const userId = parseInt(req.params.user_id! as string)
    const { email, name, password } = req.body as UpdateUserDTO

    const user = await User.findByPk(userId)

    if(!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    if(email) {
      user.set('email', email)
    }

    if(name) {
      user.set('name', name)
    }

    if(password) {
      const passwordHash = await PasswordAdapter.hashPassword(password)

      user.set('passwordHash', passwordHash)
    }

    await user.save()

    res.json(user.toJSON())
  }
}