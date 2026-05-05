import process from 'node:process'

import { z } from 'zod'

import { EnvSchema } from './env-schema'

export type EnvType = z.infer<typeof EnvSchema>

function loadEnv(): EnvType {
  console.log('Loading env')
  const envVars = { ...process.env }

  const result = EnvSchema.safeParse(envVars)

  if(!result.success) {
    console.error(z.treeifyError(result.error))
    throw new Error('❌ Invalid environment variables.')
  }

  const envData = result.data

  return envData
}

export const env: EnvType = loadEnv()

export const isProduction = env.NODE_ENV === 'production'
export const isDevelopment = env.NODE_ENV === 'development'
export const isLocal = env.NODE_ENV === 'local'
export const debug = env.DEBUG
