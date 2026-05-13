import { Op } from 'sequelize'

import { AppResponse, AuthenticatedRequest } from '@/@types/express'
import { Recipe, RecipeAuthor } from '@/database/sequelize/recipe'
import { User } from '@/database/sequelize/user'
import { AuthMiddleware } from '@/http/middlewares/auth-middleware'
import { BodyMiddleware } from '@/http/middlewares/body-middleware'
import { CreateRecipeDTO } from '@/schemas/recipe-dto'

export class RecipesController {
  @AuthMiddleware({ onlyAuthenticated: true })
  @BodyMiddleware(CreateRecipeDTO)
  async createRecipe(req: AuthenticatedRequest, res: AppResponse) {
    console.log(req.body)
    const { 
      title, 
      description, 
      instructions, 
      external_url, 
      author_ids: moreAuthorIds, 
      category_ids,
      preparation_time,
      difficulty,
      tips,
      servings,
      ingredients,
    } = req.body as CreateRecipeDTO

    const authorIds = [req.getUser().id, ...(moreAuthorIds ?? [])]

    const authors = await User.findAll({ where: { id: { [Op.in]: authorIds } } })

    if(authors.length !== authorIds.length) {
      return res.status(400).json({ message: 'Algum dos autores informados não existe' })
    }

    // const categories = await Category.findAll({ where: { id: { [Op.in]: category_ids } } })

    // if(categories.length !== category_ids.length) {
    //   return res.status(400).json({ message: 'Alguma das categorias informadas não existe' })
    // }

    const recipe = new Recipe({
      title,
      description: description ?? null,
      instructions,
      externalUrl: external_url ?? null,
      prepTime: preparation_time ?? null,
      difficulty: difficulty ?? null,
      thumbnail: null,
      tip: tips ?? null,
      servings: servings ?? null,
      ingredients: ingredients,
    })

    console.log(recipe.toJSON())

    await recipe.save()

    for(const author of authors) {
      const recipeAuthor = new RecipeAuthor({
        recipeId: recipe.id,
        userId: author.id,
      })

      console.log(recipeAuthor.toJSON())

      await recipeAuthor.save()
    }

    res.status(201).json({ id: recipe.id })
  }

  @AuthMiddleware({ onlyAuthenticated: false })
  async uploadRecipeImage(req: AuthenticatedRequest, res: AppResponse) {
    const file = req.file

    if(!file) {
      return res.status(400).json({ message: 'Arquivo de imagem é obrigatório' })
    }
    
    const { recipe_id } = req.params

    const recipe = await Recipe.findByPk(recipe_id as string)

    if(!recipe) {
      return res.status(404).json({ message: 'Receita não encontrada' })
    }
    
    await Recipe.update({ thumbnail: file.filename }, { where: { id: recipe_id } })

    res.json({ message: 'Em breve!' })
  }
}