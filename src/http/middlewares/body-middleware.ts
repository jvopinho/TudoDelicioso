import { ZodSchema } from 'zod'

import { AppRequest, AppResponse } from '@/@types/express'

export function BodyMiddleware(schema: ZodSchema) {
  return (_this: any, methodName: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value as any

    descriptor.value = function (req: AppRequest, res: AppResponse, ...args: any) {
      const validationResult = schema.safeParse(req.body)

      if(!validationResult.success) {
        return res.status(400).json({ 
          message: validationResult.error.issues.map(issue => `[${issue.input}] ${issue.message}`).join(', '),
        })
      }

      req.body = validationResult.data

      return originalMethod.call(this, req, res, ...args)
    }
  }
}