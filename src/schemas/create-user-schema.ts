import z from 'zod'

export const CreateUserDTO = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.email('Email inválido'),
  password: z.string('Senha é obrigatória').min(6, 'A senha deve conter no mínimo 6 caracteres'),
})
export type CreateUserDTO = z.infer<typeof CreateUserDTO>