import jwt from 'jsonwebtoken'

import { AppRequest, AppResponse } from '@/@types/express'
import { PasswordAdapter } from '@/adapters/password-adapter'
import { User } from '@/database/sequelize/user'
import { env } from '@/env'
import { BodyMiddleware } from '@/http/middlewares/body-middleware'
import { SignInDTO } from '@/schemas/auth-dto'

export class AuthController {
  @BodyMiddleware(SignInDTO)
  async signIn(req: AppRequest, res: AppResponse) {
    const { email, password } = req.body as SignInDTO

    const user = await User.findOne({ where: { email } })

    if(!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' })
    }

    const isMatch = await PasswordAdapter.comparePassword(password, user.passwordHash)

    if(!isMatch) {
      return res.status(401).json({ message: 'Email ou senha inválidos' })
    }

    const token = jwt.sign({
      user_id: user.id,
    }, env.SESSION_JWT_SECRET)

    res.json({ access_token: token })
  }
}