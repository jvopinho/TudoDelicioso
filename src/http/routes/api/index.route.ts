import { Application, NextFunction, Router } from 'express'

import { AppRequest, AppResponse } from '@/@types/express'
import { AuthController } from '@/controllers/auth-controller'
import { UsersController } from '@/controllers/users-controller'
import { UsersRepository } from '@/repositories/users-repository'

const usersRepository = new UsersRepository()

const authController = new AuthController(usersRepository)
const usersController = new UsersController(usersRepository)

const authRoute = Router()
  .post('/sign-in', authController.signIn.bind(authController) as Application)

const usersRoute = Router()
  .post('/', usersController.createUser.bind(usersController) as Application)
  .get('/@me', usersController.getCurrentUser.bind(usersController) as Application)
  .get('/', usersController.getAllUsers.bind(usersController) as Application)

export const apiRoute = Router()
  .use('/users', usersRoute)
  .use('/auth', authRoute)
  .use(preHandler as Application)

function preHandler(req: AppRequest, res: AppResponse, next: NextFunction) {
  req.isAuthenticated = () => false
  req.getUser = () => null
  
  next()
}