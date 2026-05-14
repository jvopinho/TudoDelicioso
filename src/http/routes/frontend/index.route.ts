import { Router } from 'express'

import { frontendAuthenticate } from '@/http/middlewares/auth-middleware'
import { CategoriesService } from '@/services/categories-service'
import { RecipesService } from '@/services/recipes-service'

import { adminFrontendRoute } from './admin.route'
import { profileFrontendRoute } from './profile.route'
import { recipesFrontendRoute } from './recipes.route'

export const frontendRoute = Router()
  .use('/recipes', recipesFrontendRoute)
  .use('/admin', adminFrontendRoute)
  .use('/profile', profileFrontendRoute)

const recipesService = new RecipesService()
const categoriesService = new CategoriesService()

frontendRoute.get('/', frontendAuthenticate({ onlyAuthenticated: false }), async(req, res) => {
  const user = req.getUser()?.toJSON()
  
  const recipes = await recipesService.getRecipes({ ascending: false })
  const categories = await categoriesService.findAllCategories()

  const randomRecipes = await recipesService.getRandomRecipes(4)

  res.render('home', {
    recipes,
    user,
    randomRecipes,
    categories,
  })
})

frontendRoute.get('/login', (req, res) => {
  res.render('login', {
    user: null,
  })
})