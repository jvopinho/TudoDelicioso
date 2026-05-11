import { Op } from 'sequelize'

import { Recipe } from '@/database/sequelize/recipe'

interface SearchRecipesOptions {
  query?: string
  limit?: number
  before?: number
  ascending?: boolean
}

export class RecipesService {
  async getRecipes(search: SearchRecipesOptions = { limit: 10 }) {
    const where: Record<string, any> = {}

    if(search.query) {
      where.title = {
        [Op.like]: `%${search.query}%`,
      }
    }

    if(search.before) {
      where.createdAt = {
        [Op.lt]: new Date(search.before),
      }
    }
    
    const recipes = await Recipe.findAll({
      where,
      limit: search.limit ?? 10,
      order: [['createdAt', search.ascending ? 'ASC' : 'DESC']],
    })

    return recipes
  }
}