import { Router } from 'express'

import { frontendAuthenticate } from '@/http/middlewares/auth-middleware'
import { RecipesService } from '@/services/recipes-service'

import { adminFrontendRoute } from './admin.route'
import { profileFrontendRoute } from './profile.route'
import { recipesFrontendRoute } from './recipes.route'

export const frontendRoute = Router()
  .use('/recipes', recipesFrontendRoute)
  .use('/admin', adminFrontendRoute)
  .use('/profile', profileFrontendRoute)

const recipesService = new RecipesService()

frontendRoute.get('/', frontendAuthenticate({ onlyAuthenticated: false }), async(req, res) => {
  const user = req.getUser()?.toJSON()
  
  const recipes = await recipesService.getRecipes({ ascending: false })

  const randomRecipes = await recipesService.getRandomRecipes(4)

  res.render('home', {
    recipes,
    user,
    randomRecipes,
  })
})

frontendRoute.get('/login', (req, res) => {
  res.render('login', {
    user: null,
  })
})