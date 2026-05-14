import { Op, Sequelize } from 'sequelize'

import { timeAgo } from '@/utils/time-utils'

import { Comment } from '@/database/mongoose/comment'
import { sequelize } from '@/database/sequelize'
import { Recipe, RecipeCategory } from '@/database/sequelize/recipe'
import { User } from '@/database/sequelize/user'

interface SearchRecipesOptions {
  query?: string
  limit?: number
  before?: number
  ascending?: boolean
}

export class RecipesService {
  async getRecipes(search: SearchRecipesOptions = {}) {
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
      limit: search.limit,
      order: [['createdAt', search.ascending ? 'ASC' : 'DESC']],
    })

    return recipes
  }

  async getRecipesByUser(userId: number) {
    const recipes = await sequelize.query(
      // eslint-disable-next-line @stylistic/quotes
      /*sql*/`SELECT r.* FROM recipes AS r INNER JOIN user_recipes AS ur ON ur."recipeId" = r.id WHERE ur."userId" = $1 ORDER BY r."id" DESC;`,
      {
        bind: [userId],
        type: 'SELECT',
      },
    )

    return recipes
  }

  async getRecipeById(id: number) {
    const recipe = await Recipe.findByPk(id)

    if(!recipe) {
      return null
    }

    const authors = await sequelize.query(
      // eslint-disable-next-line @stylistic/quotes
      /*sql*/`SELECT u.id, u.name FROM user_recipes AS ur INNER JOIN users AS u ON u.id = ur."userId" WHERE ur."recipeId" = $1`,
      {
        bind: [id],
        type: 'SELECT',
      },
    )

    console.log(authors)

    // const categories = await sequelize.query(
    //   // eslint-disable-next-line @stylistic/quotes
    //   /*sql*/`SELECT c.id, c.name, CASE WHEN rc."categoryId" IS NOT NULL THEN true ELSE false END AS selected FROM categories c LEFT JOIN recipe_categories rc ON c.id = rc."categoryId" AND rc."recipeId" = $1;`,
    //   { bind: [id], type: 'SELECT' },
    // )

    const categories = await RecipeCategory.findAll({
      where: {
        recipeId: id,
      },
    })

    return {
      ...recipe.toJSON(),
      authors,
      categories: categories.map(c => c.categoryId),
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

  async getComments(recipeId: number) {
    const comment = await Comment.find({
      recipeId,
    }, null, { sort: { createdAt: -1 } })

    const authorsIds = comment.map(c => parseInt(c.authorId.toString(), 10))

    const authors = await User.findAll({
      where: {
        id: {
          [Op.in]: authorsIds,
        },
      },
    })

    return comment.map(c => {
      const author = authors.find(a => parseInt(a.id.toString(), 10) === c.authorId)

      return {
        author: author?.name ?? 'Usuário desconhecido',
        content: c.content,
        ago: timeAgo(c.createdAt.getTime()),
      }
    })
  }
}