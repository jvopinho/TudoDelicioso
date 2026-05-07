import z from 'zod'

export const SignInDTO = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
})
export type SignInDTO = z.infer<typeof SignInDTO>