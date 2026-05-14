import z from 'zod'

export const CreateCategoryDTO = z.object({
  name: z.string().min(1, 'Nome da categoria é obrigatório'),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Cor inválida').optional().nullable(),
  slug: z.string().min(1, 'Slug é obrigatório'),
})

export type CreateCategoryDTO = z.infer<typeof CreateCategoryDTO>

export const UpdateCategoryDTO = z.object({
  name: z.string().min(1, 'Nome da categoria é obrigatório').optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Cor inválida').optional().nullable(),
  slug: z.string().min(1, 'Slug é obrigatório').optional(),
})

export type UpdateCategoryDTO = z.infer<typeof UpdateCategoryDTO>