import z from 'zod'

export const CreateSkillDTO = z.object({
  name: z.string().min(1, 'Nome da skill é obrigatório'),
  description: z.string().optional().nullable(),
  slug: z.string().min(1, 'Slug é obrigatório'),
})

export type CreateSkillDTO = z.infer<typeof CreateSkillDTO>

export const UpdateSkillDTO = z.object({
  name: z.string().min(1, 'Nome da skill é obrigatório').optional(),
  description: z.string().optional().nullable(),
  slug: z.string().min(1, 'Slug é obrigatório').optional(),
})

export type UpdateSkillDTO = z.infer<typeof UpdateSkillDTO>

export const UpdateUserSkillDTO = z.object({
  level: z.number().min(0, 'Level inválido'),
})

export type UpdateUserSkillDTO = z.infer<typeof UpdateUserSkillDTO>
