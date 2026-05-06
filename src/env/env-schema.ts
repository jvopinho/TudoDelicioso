import z from 'zod'

export const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production', 'local'])
    .default('local'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().default(3000),
  DEBUG: z.coerce.boolean().default(true),

  POSTGRES_USER: z.string().default('postgres'),
  POSTGRES_PASSWORD: z.string().default('password'),
  POSTGRES_DB: z.string().default('postgres'),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_ENDPOINT: z.string().default('localhost:5432'),

  SESSION_JWT_SECRET: z.string(),
})
export type EnvSchema = z.infer<typeof EnvSchema>