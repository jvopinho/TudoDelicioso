import { Request, Response } from 'express'

import { User } from '@/models/user'

type BaseRequest = SuperOmit<Request, 'isAuthenticated' | 'getUser'>

export type AuthenticatedRequest = BaseRequest & {
  getUser(): User
  isAuthenticated(): true
}

export type UnauthenticatedRequest = BaseRequest & {
  getUser(): null
  isAuthenticated(): false
}

export type AppRequest = BaseRequest & (AuthenticatedRequest | UnauthenticatedRequest)

export type AppResponse<Locals extends unknown = unknown> = Response<any, Locals>