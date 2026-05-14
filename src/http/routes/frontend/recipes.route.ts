import { Router } from 'express'


import { frontendAuthenticate } from '@/http/middlewares/auth-middleware'
import { AdminService } from '@/services/admin-service'
import { CategoriesService } from '@/services/categories-service'
import { RecipesService } from '@/services/recipes-service'
import { UsersService } from '@/services/users-service'

export const recipesFrontendRoute = Router()

const recipesService = new RecipesService()
const categoriesService = new CategoriesService()
const adminService = new AdminService()
const usersService = new UsersService()

recipesFrontendRoute.get('/create', frontendAuthenticate({ onlyAuthenticated: true }), async(req, res) => {
  const user = req.getUser()!.toJSON()
  
  const recipes = await recipesService.getRecipes({ ascending: false })

  const categories = await categoriesService.findAllCategories()

  const users = (await usersService.findAll({ omit: [user.id] })).map(u => ({ id: u.id, name: u.name }) )

  res.render('recipes/create', {
    // recipes,
    user,
    categories,
    users,
  })
})

recipesFrontendRoute.get('/search', frontendAuthenticate({ onlyAuthenticated: false }), async(req, res) => {
  const user = req.getUser()?.toJSON()

  const title
    = decodeURIComponent(String(req.query.title || '').trim())

  const category
    = decodeURIComponent(String(req.query.category || '').trim())
  
  const recipes = await recipesService.getRecipes({ ascending: false, query: title, categoryId: category ? parseInt(category) : undefined })
  const categories = await categoriesService.findAllCategories()

  const randomRecipes = await recipesService.getRandomRecipes(4)

  res.render('recipes/search', {
    recipes,
    user,
    randomRecipes,
    categories,
  })
})

recipesFrontendRoute.get('/:recipe_id', frontendAuthenticate({ onlyAuthenticated: false }), async(req, res) => {
  const user = req.getUser()?.toJSON()
  
  const recipe = await recipesService.getRecipeById(parseInt(req.params.recipe_id! as string))

  if(!recipe) {
    return res.redirect('/404')
  }

  const similarRecipes = await recipesService.getRandomRecipes(3)

  const comments = await recipesService.getComments(recipe.id)

  res.render('recipes/main', {
    recipe,
    user,
    similarRecipes,
    comments,
  })
})

recipesFrontendRoute.get('/:recipe_id/edit', frontendAuthenticate({ onlyAuthenticated: true }), async(req, res) => {
  const user = req.getUser()!.toJSON()

  const recipe = await recipesService.getRecipeById(parseInt(req.params.recipe_id! as string))

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

  const categories = await categoriesService.findAllCategories()

  const users = (await usersService.findAll({ omit: [user.id] })).map(u => ({ id: u.id, name: u.name }) )

  res.render('recipes/edit', {
    recipe,
    user,
    categories,
    users,
  })
})