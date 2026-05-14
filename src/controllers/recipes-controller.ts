import { Op } from 'sequelize'

import { AppResponse, AuthenticatedRequest } from '@/@types/express'
import { Comment } from '@/database/mongoose/comment'
import { Category } from '@/database/sequelize/category'
import { Recipe, RecipeAuthor, RecipeCategory } from '@/database/sequelize/recipe'
import { User } from '@/database/sequelize/user'
import { AuthMiddleware, SessionMiddleware } from '@/http/middlewares/auth-middleware'
import { BodyMiddleware } from '@/http/middlewares/body-middleware'
import { CreateCommentDTO, CreateRecipeDTO } from '@/schemas/recipe-dto'
import { UpdateRecipeDTO } from '@/schemas/recipe-dto'
import { CategoriesService } from '@/services/categories-service'
import { RecipesService } from '@/services/recipes-service'
import { UsersService } from '@/services/users-service'

export class RecipesController {
  private categoriesService = new CategoriesService()

  private recipesService = new RecipesService()

  private usersService = new UsersService()

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

    const authorIds = [...new Set([req.getUser().id, ...(moreAuthorIds ?? [])])]

    const authors = await User.findAll({ where: { id: { [Op.in]: authorIds } } })

    if(authors.length !== authorIds.length) {
      return res.status(400).json({ message: 'Algum dos autores informados não existe' })
    }

    const categories = await Category.findAll({ where: { id: { [Op.in]: category_ids } } })

    if(categories.length !== category_ids.length) {
      return res.status(400).json({ message: 'Alguma das categorias informadas não existe' })
    }

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

    for(const category of categories) {
      const recipeCategory = new RecipeCategory({
        recipeId: recipe.id,
        categoryId: category.id,
      })

      console.log(recipeCategory.toJSON())

      await recipeCategory.save()
    }

    res.status(201).json({ id: recipe.id })
  }

  @AuthMiddleware({ onlyAuthenticated: true })
  @BodyMiddleware(UpdateRecipeDTO)
  async updateRecipe(req: AuthenticatedRequest, res: AppResponse) {
    const recipeId = parseInt(req.params.recipe_id as string, 10)

    const recipe = await Recipe.findByPk(recipeId)

    if(!recipe) {
      return res.status(404).json({ message: 'Receita não encontrada' })
    }

    const user = req.getUser()

    if(user.role !== 'ADMIN') {
      const author = await RecipeAuthor.findOne({ where: { recipeId: recipe.id, userId: user.id } })

      if(!author) {
        return res.status(403).json({ message: 'Forbidden' })
      }
    }

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
    } = req.body as UpdateRecipeDTO

    if(title !== undefined) recipe.set('title', title)
    if(description !== undefined) recipe.set('description', description ?? null)
    if(instructions !== undefined) recipe.set('instructions', instructions)
    if(external_url !== undefined) recipe.set('externalUrl', external_url ?? null)
    if(preparation_time !== undefined) recipe.set('prepTime', preparation_time ?? null)
    if(difficulty !== undefined) recipe.set('difficulty', difficulty ?? null)
    if(tips !== undefined) recipe.set('tip', tips ?? null)
    if(servings !== undefined) recipe.set('servings', servings ?? null)
    if(ingredients !== undefined) recipe.set('ingredients', ingredients)

    await recipe.save()

    console.log(moreAuthorIds)

    if(moreAuthorIds !== undefined) {
      const authorIds = [...new Set([user.id, ...(moreAuthorIds ?? [])].map(x => parseInt(x.toString())))]

      console.log(authorIds)

      const authors = await User.findAll({ where: { id: authorIds } })

      if(authors.length !== authorIds.length) {
        return res.status(400).json({ message: 'Algum dos autores informados não existe' })
      }

      // replace authors
      await RecipeAuthor.destroy({ where: { recipeId: recipe.id } })

      for(const author of authors) {
        const recipeAuthor = new RecipeAuthor({ recipeId: recipe.id, userId: author.id })

        await recipeAuthor.save()
      }
    }

    if(category_ids !== undefined) {
      const categoryIds = category_ids

      const categories = await Category.findAll({ where: { id: categoryIds } })

      if(categories.length !== categoryIds.length) {
        return res.status(400).json({ message: 'Algum dos autores informados não existe' })
      }

      // replace categories
      await RecipeCategory.destroy({ where: { recipeId: recipe.id } })

      for(const category of categories) {
        const recipeCategory = new RecipeCategory({ recipeId: recipe.id, categoryId: category.id })

        await recipeCategory.save()
      }
    }

    res.json({ id: recipe.id })
  }

  @AuthMiddleware({ onlyAuthenticated: true })
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

  @AuthMiddleware({ onlyAuthenticated: true })
  async deleteRecipe(req: AuthenticatedRequest, res: AppResponse) {
    const recipeId = parseInt(req.params.recipe_id as string, 10)

    const recipe = await Recipe.findByPk(recipeId)

    if(!recipe) {
      return res.status(404).json({ message: 'Receita não encontrada' })
    }

    const user = req.getUser()

    if(user.role !== 'ADMIN') {
      const author = await RecipeAuthor.findOne({ where: { recipeId: recipe.id, userId: user.id } })

      if(!author) {
        return res.status(403).json({ message: 'Forbidden' })
      }
    }

    await recipe.destroy()

    await RecipeAuthor.destroy({ where: { recipeId: recipe.id } })
    await RecipeCategory.destroy({ where: { recipeId: recipe.id } })

    res.status(204).send()
  }

  @AuthMiddleware({ onlyAuthenticated: true })
  @BodyMiddleware(CreateCommentDTO)
  async createComment(req: AuthenticatedRequest, res: AppResponse) {
    const user = req.getUser()
    const body = req.body as CreateCommentDTO

    const recipeId = parseInt(req.params.recipe_id as string, 10)

    const recipe = await Recipe.findByPk(recipeId)

    if(!recipe) {
      return res.status(404).json({ message: 'Receita não encontrada' })
    }

    if(!body.content.trim()) {
      return res.status(400).json({ message: 'Conteúdo do comentário é obrigatório' })
    }

    const comment = await Comment.create({
      authorId: parseInt(user.id.toString(), 10),
      recipeId,
      content: body.content.trim(),
    })

    res.status(201).json({ id: comment._id })
  }

  @SessionMiddleware({ onlyAuthenticated: true })
  async viewCreate(req: AuthenticatedRequest, res: AppResponse) {
    const user = req.getUser()!.toJSON()
    
    const recipes = await this.recipesService.getRecipes({ ascending: false })
    const categories = await this.categoriesService.findAllCategories()
    const users = (await this.usersService.findAll({ omit: [user.id] })).map(u => ({ id: u.id, name: u.name }))

    res.render('recipes/create', {
      user,
      categories,
      users,
    })
  }

  @SessionMiddleware({ onlyAuthenticated: false })
  async viewSearch(req: AuthenticatedRequest, res: AppResponse) {
    const user = req.getUser()?.toJSON()

    const title = decodeURIComponent(String(req.query.title || '').trim())
    const category = decodeURIComponent(String(req.query.category || '').trim())
    
    const recipes = await this.recipesService.getRecipes({ 
      ascending: false, 
      query: title, 
      categoryId: category ? parseInt(category) : undefined, 
    })
    const categories = await this.categoriesService.findAllCategories()
    const randomRecipes = await this.recipesService.getRandomRecipes(4)

    res.render('recipes/search', {
      recipes,
      user,
      randomRecipes,
      categories,
    })
  }

  @SessionMiddleware({ onlyAuthenticated: false })
  async viewRecipe(req: AuthenticatedRequest, res: AppResponse) {
    const user = req.getUser()?.toJSON()
    
    const recipe = await this.recipesService.getRecipeById(parseInt(req.params.recipe_id! as string))

    if(!recipe) {
      return res.redirect('/404')
    }

    const similarRecipes = await this.recipesService.getRandomRecipes(3)
    const comments = await this.recipesService.getComments(recipe.id)

    res.render('recipes/main', {
      recipe,
      user,
      similarRecipes,
      comments,
    })
  }

  @SessionMiddleware({ onlyAuthenticated: true })
  async viewEdit(req: AuthenticatedRequest, res: AppResponse) {
    const user = req.getUser()!.toJSON()

    const recipe = await this.recipesService.getRecipeById(parseInt(req.params.recipe_id! as string))

    if(!recipe) {
      return res.redirect('/')
    }

    // authorization: only ADMIN or an author can edit
    const isAuthor = (recipe.authors || []).some((a: any) => a.id === user?.id)

    if(user?.role !== 'ADMIN' && !isAuthor) {
      return res.redirect('/403')
    }

    const authorIndex = (recipe.authors || []).findIndex((a: any) => a.id === user?.id)

    if(authorIndex > -1) {
      const [author] = recipe.authors.splice(authorIndex, 1)

      recipe.authors.unshift(author)
    }

    const categories = await this.categoriesService.findAllCategories()
    const users = (await this.usersService.findAll({ omit: [user.id] })).map(u => ({ id: u.id, name: u.name }))

    res.render('recipes/edit', {
      recipe,
      user,
      categories,
      users,
    })
  }
}