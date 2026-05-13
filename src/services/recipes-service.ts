import { Op, Sequelize } from 'sequelize'

import { sequelize } from '@/database/sequelize'
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

  async getRecipeById(id: number) {
    const recipe = await Recipe.findByPk(id)

    if(!recipe) {
      return null
    }

    const authors = await sequelize.query(
      // eslint-disable-next-line @stylistic/quotes
      /*sql*/`SELECT u.id, u.name, u.email, u.role FROM user_recipes AS ur INNER JOIN users AS u ON u.id = ur."userId" WHERE ur."recipeId" = $1`,
      {
        bind: [id],
        type: 'SELECT',
      },
    )

    console.log(authors)

    return {
      ...recipe.toJSON(),
      authors,
    }
  }

  async getRandomRecipes(limit: number = 4) {
    const recipes = await Recipe.findAll({
      where: {
        thumbnail: {
          [Op.and]: {
            [Op.not]: null,
            [Op.ne]: '',
          },
        },
      },
    
      order: Sequelize.literal('RANDOM()'),
    
      limit,
    })

    return recipes
  }
}