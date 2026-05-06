import { ZodSchema } from 'zod'

import { AppRequest, AppResponse } from '@/@types/express'

export function BodyMiddleware(schema: ZodSchema) {
  return (_this: any, methodName: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value as any

    descriptor.value = function (req: AppRequest, res: AppResponse, ...args: any) {
      const validationResult = schema.safeParse(req.body)

      if(!validationResult.success) {
        return res.status(400).json({ 
          message: 'Invalid request body', 
          errors: validationResult.error.issues, 
        })
      }

      req.body = validationResult.data

      return originalMethod.call(_this, req, res, ...args)
    }
  }
}