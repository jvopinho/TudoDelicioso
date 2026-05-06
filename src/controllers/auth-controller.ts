import jwt from 'jsonwebtoken'

import { AppRequest, AppResponse } from '@/@types/express'
import { PasswordAdapter } from '@/adapters/password-adapter'
import { env } from '@/env'
import { BodyMiddleware } from '@/http/middlewares/body-middleware'
import { UsersRepository } from '@/repositories/users-repository'
import { SignInDTO } from '@/schemas/sign-in-schema'

export class AuthController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @BodyMiddleware(SignInDTO)
  async signIn(req: AppRequest, res: AppResponse) {
    const { email, password } = req.body as SignInDTO

    const user = await this.usersRepository.findByEmail(email)

    if(!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' })
    }

    const isMatch = await PasswordAdapter.comparePassword(password, user.getPasswordHash())

    if(!isMatch) {
      return res.status(401).json({ message: 'Email ou senha inválidos' })
    }

    const token = jwt.sign({
      user_id: user.id,
    }, env.SESSION_JWT_SECRET)

    res.json({ access_token: token })
  }
}