import { Router } from 'express'

import { frontendAuthenticate } from '@/http/middlewares/auth-middleware'
import { RecipesService } from '@/services/recipes-service'

import { recipesFrontendRoute } from './recipes.route'

export const frontendRoute = Router()
  .use('/recipes', recipesFrontendRoute)

const recipesService = new RecipesService()

frontendRoute.get('/', frontendAuthenticate({ onlyAuthenticated: false }), async(req, res) => {
  const user = req.getUser()?.toJSON()
  
  const recipes = await recipesService.getRecipes({ ascending: false })

  res.render('home', {
    recipes,
    user,
  })
})