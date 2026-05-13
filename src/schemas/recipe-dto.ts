import z from 'zod'

export const CreateRecipeDTO = z.object({
  title: z.string().min(1, 'Nome da receita é obrigatório'),
  description: z.string().max(1024, 'Descrição deve ter no máximo 1024 caracteres').nullable(),
  instructions: z.string().array().min(1, 'Pelo menos uma instrução é obrigatória'),
  external_url: z.url('Link externa inválida').nullable(),
  author_ids: z.int().array().nullable(),
  category_ids: z.string().array(),//.min(1, 'Pelo menos uma categoria é obrigatória'),
  preparation_time: z.number().int().positive('Tempo de preparo deve ser um número inteiro positivo').nullable(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).nullable(),
  tips: z.string().nullable(),
  servings: z.number().int().positive('Número de porções deve ser um número inteiro positivo').nullable(),
  ingredients: z.array(z.string().min(1, 'Nome do ingrediente é obrigatório')).min(1, 'Pelo menos um ingrediente é obrigatório'),
})
export type CreateRecipeDTO = z.infer<typeof CreateRecipeDTO>