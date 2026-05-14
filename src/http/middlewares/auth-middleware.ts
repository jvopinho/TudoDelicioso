import { Application, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { parseCookies } from '@/utils/cookie-parse'

import { AppRequest, AppResponse, AuthenticatedRequest } from '@/@types/express'
import { User } from '@/database/sequelize/user'
import { env } from '@/env'

interface AuthMiddlewareOptions {
  onlyAuthenticated?: boolean
  onlyAdmin?: boolean
}

export function isAuthenticated(req: AppRequest): req is AuthenticatedRequest {
  return req.isAuthenticated()
}

async function authenticate(authHeader: string): Promise<[true, User] | [false, { status: number, message: string }]> {
  if(!authHeader) {
    return [false, { 
      status: 401, 
      message: 'Authorization header is missing', 
    }]
  }

  let token: { user_id: number }

  try {
    token = jwt.verify(authHeader, env.SESSION_JWT_SECRET) as typeof token
  } catch (err) {
    return [false, { 
      status: 401, 
      message: 'Invalid token', 
    }]
  }

  const user = await User.findByPk(token.user_id)

  if(!user) {
    return [false, { 
      status: 401, 
      message: 'User not found', 
    }]
  }

  return [true, user]
}

export function frontendAuthenticate({ onlyAuthenticated = true, onlyAdmin = false }: AuthMiddlewareOptions = {}) {
  return (async (req: AppRequest, res: AppResponse, next: NextFunction) => {
    const cookies = parseCookies(req.headers.cookie)

    const [authenticated, result] = await authenticate(cookies.get('session_token')!)

    if(authenticated) {
      const user = result as User

      if(onlyAdmin && user.role !== 'ADMIN') {
        return res.redirect('/403')
      }

      req.isAuthenticated = () => authenticated as true
      req.getUser = () => user
    } else {
      if(onlyAuthenticated) {
        return res.redirect('/login')
      }
      
      req.isAuthenticated = () => false
    }

    return next()
  }) as Application
}

export function AuthMiddleware({ onlyAuthenticated = true, onlyAdmin = false }: AuthMiddlewareOptions = {}) {
  if(onlyAdmin && !onlyAuthenticated) {
    throw new Error('Invalid AuthMiddleware configuration: onlyAdmin cannot be true if onlyAuthenticated is false')
  }
  
  return (_this: any, methodName: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (req: AppRequest, res: AppResponse, next: NextFunction) {
      const authHeader = req.headers['authorization']

      const [authenticated, result] = await authenticate(authHeader!)

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

      return originalMethod.call(this, req, res, next)
    }
  }
}