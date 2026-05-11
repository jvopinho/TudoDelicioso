import z from 'zod'

export const CreateRecipeDTO = z.object({
  title: z.string().min(1, 'Nome da receita é obrigatório'),
  description: z.string().max(200, 'Descrição deve ter no máximo 200 caracteres').nullable(),
  instructions: z.string().min(1, 'Instruções são obrigatórias'),
  external_url: z.url('Link externa inválida').nullable(),
  author_ids: z.int().array().min(1, 'Pelo menos um autor é obrigatório'),
  category_ids: z.int().array(),//.min(1, 'Pelo menos uma categoria é obrigatória'),
})
export type CreateRecipeDTO = z.infer<typeof CreateRecipeDTO>