import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

import { AppRequest, AuthenticatedRequest } from '@/@types/express'
import { env } from '@/env'
import { User } from '@/models/user'
import { UsersRepository } from '@/repositories'

interface AuthMiddlewareOptions {
  onlyAuthenticated?: boolean
  onlyAdmin?: boolean
}

export function isAuthenticated(req: AppRequest): req is AuthenticatedRequest {
  return req.isAuthenticated()
}

async function authenticate(req: AppRequest): Promise<[true, User] | [false, { status: number, message: string }]> {
  const usersRepository = new UsersRepository()
  
  const authHeader = req.headers['authorization']

  if(!authHeader) {
    return [false, { 
      status: 401, 
      message: 'Authorization header is missing', 
    }]
  }

  let token: { user_id: string }

  try {
    token = jwt.verify(authHeader, env.SESSION_JWT_SECRET) as typeof token
  } catch (err) {
    return [false, { 
      status: 401, 
      message: 'Invalid token', 
    }]
  }

  const user = await usersRepository.findById(token.user_id)

  if(!user) {
    return [false, { 
      status: 401, 
      message: 'User not found', 
    }]
  }

  return [true, user]
}

export function AuthMiddleware({ onlyAuthenticated = true, onlyAdmin = false }: AuthMiddlewareOptions = {}) {
  if(onlyAdmin && !onlyAuthenticated) {
    throw new Error('Invalid AuthMiddleware configuration: onlyAdmin cannot be true if onlyAuthenticated is false')
  }
  
  return (_this: any, methodName: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value as RequestHandler

    descriptor.value = async function (req: AppRequest, res, ...args) {
      const [authenticated, result] = await authenticate(req)

      if(!authenticated && onlyAuthenticated) {
        const { status, message } = result

        return res.status(status).json({ message })
      }

      const user = result as User

      req.isAuthenticated = () => authenticated as true
      
      if(user instanceof User) {
        req.getUser = () => user
      }

      if(onlyAdmin && user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden' })
      }

      return originalMethod.call(_this, req, res, ...args)
    } as RequestHandler
  }
}